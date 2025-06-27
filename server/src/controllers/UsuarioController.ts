import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../database';

interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  id_club: number | null;
}

export const loginUsuario = async (req: Request, res: Response) => {
  const { correo, contraseña } = req.body;

  try {
    console.log('Credenciales recibidas:', correo, contraseña); // 👀 Verifica lo que llega

    const rows: Usuario[] = await pool.query(
      'SELECT id_usuario, nombre, correo, rol, id_club FROM usuario WHERE correo = ? AND contraseña = ?',
      [correo, contraseña]
    );

    if (rows.length > 0) {
      const usuario = rows[0];

      const token = jwt.sign(
        {
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          rol: usuario.rol,
          correo: usuario.correo,
          id_club: usuario.id_club, // ✅ Incluido correctamente
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '2h' }
      );

      res.json({ success: true, token, usuario });
    } else {
      res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
