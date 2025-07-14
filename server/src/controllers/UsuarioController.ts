import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../database';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger';
import { enviarAlertaCorreo } from '../utils/mailer';

interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  id_club: number | null;
  contraseña: string;
  intentos_fallidos: number;
  bloqueado_hasta: Date | null;
}

export const loginUsuario = async (req: Request, res: Response): Promise<void> => {
  const { correo, contraseña } = req.body;

  try {
    const rows = await pool.query(
      'SELECT * FROM usuario WHERE correo = ?',
      [correo]
    ) as Usuario[];

    if (rows.length === 0) {
      logger.warn('Intento de login fallido: correo no registrado', { correo, ip: req.ip });
      res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
      return;
    }

    const usuario = rows[0];

    if (usuario.bloqueado_hasta && new Date(usuario.bloqueado_hasta) > new Date()) {
      logger.warn('Intento de acceso a cuenta bloqueada', {
        correo: usuario.correo,
        bloqueado_hasta: usuario.bloqueado_hasta,
        ip: req.ip
      });
      res.status(403).json({
        success: false,
        message: `Tu cuenta está bloqueada hasta las ${usuario.bloqueado_hasta.toLocaleString()}`
      });
      return;
    }

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!contraseñaValida) {
      const nuevosIntentos = usuario.intentos_fallidos + 1;

      if (nuevosIntentos >= 5) {
        await pool.query(
          `UPDATE usuario 
           SET intentos_fallidos = ?, bloqueado_hasta = DATE_ADD(NOW(), INTERVAL 15 MINUTE) 
           WHERE id_usuario = ?`,
          [nuevosIntentos, usuario.id_usuario]
        );

        logger.warn('Cuenta bloqueada por intentos fallidos', {
          correo: usuario.correo,
          ip: req.ip,
          intentos_fallidos: nuevosIntentos
        });

        // Enviar alerta por correo
        await enviarAlertaCorreo(
          'angelrico122001@gmail.com',  // pon aquí tu correo de administrador o seguridad
          `Alerta: Cuenta bloqueada - usuario ${usuario.correo}`,
          `<p>La cuenta con correo <b>${usuario.correo}</b> ha sido bloqueada por ${nuevosIntentos} intentos fallidos consecutivos.</p>
           <p>IP: ${req.ip}</p>
           <p>Fecha: ${new Date().toLocaleString()}</p>`
        );

        res.status(403).json({
          success: false,
          message: 'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.'
        });
        return;
      } else {
        await pool.query(
          `UPDATE usuario SET intentos_fallidos = ? WHERE id_usuario = ?`,
          [nuevosIntentos, usuario.id_usuario]
        );
      }

      logger.warn('Contraseña incorrecta', {
        correo: usuario.correo,
        ip: req.ip,
        intentos_fallidos: nuevosIntentos
      });

      res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
      return;
    }

    // Login exitoso: limpia los intentos
    await pool.query(
      `UPDATE usuario SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id_usuario = ?`,
      [usuario.id_usuario]
    );

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol,
        correo: usuario.correo,
        id_club: usuario.id_club,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '600s' }
    );

    delete (usuario as any).contraseña;

    logger.info('Login exitoso', {
      id_usuario: usuario.id_usuario,
      correo: usuario.correo,
      ip: req.ip
    });

    res.json({ success: true, token, usuario });

  } catch (error) {
    logger.error('Error en el login', { error, correo, ip: req.ip });
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
