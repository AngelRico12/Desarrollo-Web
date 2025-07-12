import { Request, Response } from 'express';
import pool from '../database';
import bcrypt from 'bcryptjs';
import { MulterRequest } from './types'; // si defines la interfaz para req.files como lo hiciste arriba
import path from 'path';

export const getClubInfo = async (req: Request, res: Response): Promise<void> => {
  const { id_club } = req.params;
  const id = Number(id_club);

  try {
    const clubRows = await pool.query('SELECT * FROM club WHERE id_club = ?', [id]);

    const equipoRows = await pool.query('SELECT * FROM equipo WHERE id_club = ?', [id]);
const usuarioRows = await pool.query('SELECT * FROM usuario WHERE id_club = ? AND rol = "administrador_equipo" LIMIT 1', [id]);


    if (!Array.isArray(clubRows) || clubRows.length === 0) {
      res.status(404).json({ success: false, message: 'Club no encontrado.' });
      return;
    }

    res.json({
      success: true,
      club: clubRows[0],
      equipo: equipoRows[0] || null,
      usuario: usuarioRows.find((u: any) => u.rol === 'administrador_equipo') || null,
    });
  } catch (error) {
    console.error('Error al obtener datos del club:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

export const updateClubInfo = async (req: Request, res: Response): Promise<void> => {
  const { id_club } = req.params;
  const { nombre, correo, contraseña } = req.body;
  const files = (req as MulterRequest).files;

  try {
    const [clubRows] = await pool.query('SELECT * FROM club WHERE id_club = ?', [id_club]);

    if (!Array.isArray(clubRows) || clubRows.length === 0) {
      res.status(404).json({ success: false, message: 'Club no encontrado.' });
      return;
    }

    const updatesClub: string[] = [];
    const valuesClub: any[] = [];

    const updatesUsuario: string[] = [];
    const valuesUsuario: any[] = [];

    const updatesEquipo: string[] = [];
    const valuesEquipo: any[] = [];

    // --- Nombre ---
    if (nombre) {
      updatesClub.push('nombre = ?');
      valuesClub.push(nombre);

      updatesUsuario.push('nombre = ?');
      valuesUsuario.push(nombre);

      updatesEquipo.push('nombre = ?');
      valuesEquipo.push(nombre);
    }

    // --- Correo ---
    if (correo) {
      updatesClub.push('correo = ?');
      valuesClub.push(correo);

      updatesUsuario.push('correo = ?');
      valuesUsuario.push(correo);
    }

    // --- Logotipo ---
    if (files?.['logotipo']?.[0]) {
      const logotipoPath = '/' + files['logotipo'][0].path.replace(path.join(__dirname, '../../'), '').replace(/\\/g, '/');
      updatesClub.push('logotipo = ?');
      valuesClub.push(logotipoPath);
    }

    // --- Contraseña ---
    if (contraseña) {
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      updatesUsuario.push('contraseña = ?');
      valuesUsuario.push(hashedPassword);
    }

    // --- Ejecutar actualizaciones solo si hay algo que actualizar ---
    if (updatesClub.length > 0) {
      await pool.query(`UPDATE club SET ${updatesClub.join(', ')} WHERE id_club = ?`, [...valuesClub, id_club]);
    }

    if (updatesEquipo.length > 0) {
      await pool.query(`UPDATE equipo SET ${updatesEquipo.join(', ')} WHERE id_club = ?`, [...valuesEquipo, id_club]);
    }

    if (updatesUsuario.length > 0) {
      await pool.query(
        `UPDATE usuario SET ${updatesUsuario.join(', ')} WHERE id_club = ? AND rol = "administrador_equipo"`,
        [...valuesUsuario, id_club]
      );
    }

    res.json({ success: true, message: 'Información actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar información:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};


export const requestClubDeletion = async (req: Request, res: Response): Promise<void> => {
  const { id_club } = req.params;

  try {
    // Aquí podrías marcar como 'pendiente_baja' o eliminar directamente según tu lógica
    await pool.query('UPDATE club SET estado = ? WHERE id_club = ?', ['pendiente_baja', id_club]);

    res.json({
      success: true,
      message: 'Solicitud de baja enviada. El club será eliminado tras revisión.',
    });
  } catch (error) {
    console.error('Error al solicitar baja:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};
