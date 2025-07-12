import { Request, Response } from 'express';
import pool from '../database';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Configuración de Multer para almacenar logotipos y certificados
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { nombre } = req.body;

    if (!nombre) {
      cb(new Error('El nombre del club es obligatorio para definir la carpeta.'), '');
      return;
    }

    const sanitizedNombre = nombre.replace(/[^a-zA-Z0-9]/g, '_');
    const baseDir = path.join(__dirname, '../../uploads', sanitizedNombre);
    const specificDir = path.join(baseDir, file.fieldname);

    if (!fs.existsSync(specificDir)) {
      fs.mkdirSync(specificDir, { recursive: true });
    }

    cb(null, specificDir);
  },
  filename: (req, file, cb) => {
    if (file.fieldname === 'logotipo') {
      cb(null, 'logo.png');
    } else if (file.fieldname === 'certificado') {
      cb(null, 'certificado.pdf');
    } else {
      const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      cb(null, sanitizedFileName);
    }
  },
});

export const upload = multer({ storage });

interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

// Función para calcular el hash SHA-256 de un archivo
function calcularHashArchivo(filePath: string): string {
  const archivo = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(archivo).digest('hex');
}

// Controlador actualizado
export const registerClub = async (req: Request, res: Response): Promise<void> => {
  const { nombre, correo } = req.body;
  const files = (req as MulterRequest).files;

  // Validaciones de entrada
  if (
    typeof nombre !== 'string' ||
    typeof correo !== 'string' ||
    !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(correo) ||
    nombre.trim().length < 3 ||
    nombre.trim().length > 100
  ) {
    res.status(400).json({ success: false, message: 'Nombre o correo inválidos.' });
    return;
  }

  if (!files?.['certificado'] || !files?.['logotipo']) {
    res.status(400).json({ success: false, message: 'Debe enviar certificado y logotipo.' });
    return;
  }

  const certificadoFile = files['certificado'][0];
  const logotipoFile = files['logotipo'][0];

  // Convertir rutas a relativas
  const transformPath = (filePath: string) =>
    '/' + filePath.replace(path.join(__dirname, '../../'), '').replace(/\\/g, '/');

  const certificadoPath = transformPath(certificadoFile.path);
  const logotipoPath = transformPath(logotipoFile.path);

  // ✅ Calcular hash SHA-256 de los archivos
  const certificadoHash = calcularHashArchivo(certificadoFile.path);
  const logotipoHash = calcularHashArchivo(logotipoFile.path);

  try {
    const result = await pool.query(
      `INSERT INTO club (nombre, correo, certificado, certificado_hash, logotipo, logotipo_hash, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, correo, certificadoPath, certificadoHash, logotipoPath, logotipoHash, 'pendiente']
    );

    const clubId = result.insertId;

    res.status(201).json({
      success: true,
      message: 'Registro exitoso. El club está en estado pendiente de aprobación.',
      club: {
        id_club: clubId,
        nombre,
        correo,
        certificado: certificadoPath,
        certificado_hash: certificadoHash,
        logotipo: logotipoPath,
        logotipo_hash: logotipoHash,
        estado: 'pendiente',
      },
    });
  } catch (error) {
    console.error('Error al registrar el club:', error);
    if ((error as any).code === 'ER_DUP_ENTRY') {
      res.status(400).json({ success: false, message: 'El correo ya está registrado.' });
    } else {
      res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
  }
};
