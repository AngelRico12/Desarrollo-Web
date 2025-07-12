// middlewares/validarLogin.ts
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validarLogin = () => {
  return [
    body('correo').isEmail().withMessage('Correo inválido'),
    body('contraseña').notEmpty().withMessage('Contraseña requerida'),

    // ✅ Esta función ahora solo retorna void
    (req: Request, res: Response, next: NextFunction): void => {
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        res.status(400).json({ success: false, errores: errores.array() });
        return; // ✅ Detiene ejecución para evitar pasar a next()
      }
      next();
    }
  ];
};
