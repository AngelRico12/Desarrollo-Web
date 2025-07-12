import { Router } from 'express';
import { loginUsuario } from '../controllers/UsuarioController';

const router = Router();

// Ruta para iniciar sesión
router.post('/login', loginUsuario);

// Ruta para intento fallido


export default router;
