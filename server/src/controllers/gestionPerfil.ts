import { Request, Response } from 'express';
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
        contrasena: contraseña
      }
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

// Actualizar perfil
export const updateUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const campos = req.body;

  try {
    const camposActualizables = Object.keys(campos).filter(key => ['nombre', 'correo', 'contrasena'].includes(key));
    const valores = camposActualizables.map(k => campos[k]);

    if (camposActualizables.length === 0) {
      res.status(400).json({ success: false, message: 'No hay campos válidos para actualizar' });
      return;
    }

    const sql = `UPDATE usuario SET ${camposActualizables.map(k => `${k === 'contrasena' ? 'contraseña' : k} = ?`).join(', ')} WHERE id_usuario = ?`;
    await pool.query(sql, [...valores, id]);

    res.json({ success: true, message: 'Campo(s) actualizado(s) correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar perfil' });
  }
};
