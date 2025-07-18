// ✅ 1. Controlador en TypeScript para jugadores
import { Request, Response } from 'express';
import pool from '../database';

// Obtener todos los jugadores
export const getJugadores = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM jugador');
    res.json({ success: true, jugadores: result });
  } catch (error) {
    console.error('Error al obtener jugadores:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

// Eliminar jugador junto con sus folios
export const eliminarJugador = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    // Primero eliminar registros relacionados en folio_jugador
    await pool.query('DELETE FROM folio_jugador WHERE id_jugador = ?', [id]);

    // Luego eliminar el jugador
    await pool.query('DELETE FROM jugador WHERE id_jugador = ?', [id]);

    res.json({ success: true, message: 'Jugador y folios eliminados correctamente' });
  } catch (error) {
    console.error('Error al eliminar jugador:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};


export default {
  getJugadores,
  eliminarJugador
};
