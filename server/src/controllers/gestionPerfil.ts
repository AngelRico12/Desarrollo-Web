import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../database';

// Obtener usuario por ID
export const getUsuarioById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [id]);

    if (result.length === 0) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }

    const { id_usuario, nombre, correo, contraseña } = result[0];
    res.json({
      success: true,
      usuario: {
        id_usuario,
        nombre,
        correo,
        contrasena: contraseña, // opcional: usa 'contrasena' para front
      },
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

// Actualizar usuario
export const updateUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const campos = req.body;

  try {
    const camposPermitidos = ['nombre', 'correo', 'contrasena'];
    const camposActualizables = Object.keys(campos).filter(key => camposPermitidos.includes(key));

    if (camposActualizables.length === 0) {
      res.status(400).json({ success: false, message: 'No hay campos válidos para actualizar' });
      return;
    }

    const valores: any[] = [];

    for (const key of camposActualizables) {
      if (key === 'contrasena') {
        if (typeof campos[key] !== 'string' || campos[key].trim() === '') {
          res.status(400).json({ success: false, message: 'Contraseña inválida' });
          return;
        }
        const hash = await bcrypt.hash(campos[key], 10);
        valores.push(hash);
      } else {
        valores.push(campos[key]);
      }
    }

    const sql = `UPDATE usuario SET ${camposActualizables
      .map(k => (k === 'contrasena' ? 'contraseña = ?' : `${k} = ?`))
      .join(', ')} WHERE id_usuario = ?`;

    await pool.query(sql, [...valores, id]);

    res.json({ success: true, message: 'Campo(s) actualizado(s) correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar perfil' });
  }
};
