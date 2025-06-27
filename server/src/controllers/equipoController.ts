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
    // 1. Obtener los jugadores asociados al equipo
    const jugadores = await pool.query('SELECT id_jugador FROM jugador WHERE id_equipo = ?', [id]);
    
    // Extraemos los ids de jugadores
    const idsJugadores = jugadores.map((j: any) => j.id_jugador);

    if (idsJugadores.length > 0) {
      // 2. Eliminar de folio_jugador todos los registros vinculados a esos jugadores
      await pool.query('DELETE FROM folio_jugador WHERE id_jugador IN (?)', [idsJugadores]);

      // 3. Eliminar los jugadores vinculados al equipo
      await pool.query('DELETE FROM jugador WHERE id_equipo = ?', [id]);
    }

    // 4. Finalmente eliminar el equipo
    await pool.query('DELETE FROM equipo WHERE id_equipo = ?', [id]);

    res.json({ success: true, message: 'Equipo y registros relacionados eliminados correctamente' });
  } catch (error) {
    console.error('Error al eliminar equipo:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }


};
