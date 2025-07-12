import { Request, Response } from 'express';
import pool from '../database';


export const recibirIntentoFallido = async (req: Request, res: Response): Promise<void> => {
  const { correo, ip } = req.body;

  console.log('📥 Intento fallido recibido');
  console.log('Correo intentado:', correo);
  console.log('IP del cliente:', ip || req.ip);

  // Puedes responder algo sencillo
  res.status(200).json({ success: true, message: 'Intento fallido recibido correctamente' });
};
