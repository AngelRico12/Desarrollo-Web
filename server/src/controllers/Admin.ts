import { Request, Response } from 'express';
import db from '../database';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';


class ClubController {
  // Listar solicitudes de clubes
  static async listarSolicitudes(req: Request, res: Response): Promise<void> {
    try {
      const solicitudes = await db.query('SELECT * FROM club WHERE estado = ?', ['pendiente']);

      solicitudes.forEach((club: any) => {
        club.certificado = `http://localhost:3000${club.certificado.replace(/\\/g, '/')}`;
        club.logotipo = `http://localhost:3000${club.logotipo.replace(/\\/g, '/')}`;
      });

      res.status(200).json(solicitudes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener las solicitudes de clubes.' });
    }
  }

  // Aprobar un club y crear el usuario administrador del equipo
  static async aprobarClub(req: Request, res: Response): Promise<void> {
    const { id_club } = req.params;
    let connection;

    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      const club = await connection.query('SELECT * FROM club WHERE id_club = ?', [id_club]);

      if (!club || club.length === 0) {
        res.status(404).json({ message: 'Club no encontrado.' });
        return;
      }

      const { nombre, correo } = club[0];
      const contraseña = randomBytes(8).toString('hex');
      const hashedPassword = await bcrypt.hash(contraseña, 10); // 🔐 Encriptar la contraseña

      await connection.query(
        'INSERT INTO usuario (nombre, correo, contraseña, rol, id_club) VALUES (?, ?, ?, ?, ?)',
        [nombre, correo, hashedPassword, 'administrador_equipo', id_club]
      );

      await connection.query('UPDATE club SET estado = ? WHERE id_club = ?', ['aprobado', id_club]);
      await connection.commit();
      connection.release();

      await ClubController.enviarCorreo(correo, contraseña);

      res.status(200).json({ message: 'Club aprobado y usuario administrador creado.' });
    } catch (error) {
      console.error(error);
      if (connection) await connection.rollback();
      res.status(500).json({ message: 'Error al aprobar el club.' });
    }
  }

  // Eliminar un club
  static async eliminarClub(req: Request, res: Response): Promise<void> {
    const { id_club } = req.params;

    try {
      const result = await db.query('DELETE FROM club WHERE id_club = ?', [id_club]);

      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Club no encontrado.' });
        return;
      }

      res.status(200).json({ message: 'Club eliminado correctamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar el club.' });
    }
  }

  // Enviar correo con la contraseña generada
  static async enviarCorreo(correo: string, contraseña: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mitsimy@gmail.com', // Cambiar por tu correo real
        pass: 'nxkl umfw mmho geaa', // Cambiar por tu contraseña real o app password
      },
    });

    const mensaje = {
      from: 'mitsimy@gmail.com',
      to: correo,
      subject: 'Cuenta de Administrador de Equipo Creada',
      html: `
        <h2>Bienvenido a la plataforma</h2>
        <p>Su cuenta de administrador de equipo ha sido creada con éxito. Aquí están sus credenciales:</p>
        <ul>
          <li><b>Correo:</b> ${correo}</li>
          <li><b>Contraseña:</b> ${contraseña}</li>
        </ul>
        <p>Por favor, cambie su contraseña después de iniciar sesión.</p>
      `,
    };

    await transporter.sendMail(mensaje);
  }
}

export default ClubController;

