import { Request, Response } from 'express';
import pool from '../database';

// Obtener todos los equipos
export const getEquipos = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM equipo');
    res.json({ success: true, equipos: result });
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

// Cambiar el estado de un equipo
export const cambiarEstado = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    await pool.query('UPDATE equipo SET estado = ? WHERE id_equipo = ?', [estado, id]);
    res.json({ success: true, message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al cambiar estado del equipo:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

// Eliminar un equipo por ID
export const eliminarEquipo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM equipo WHERE id_equipo = ?', [id]);
    res.json({ success: true, message: 'Equipo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar equipo:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};
