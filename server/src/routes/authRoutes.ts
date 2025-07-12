import { Router } from 'express';
import {recibirIntentoFallido} from '../controllers/empleadoController'

const router = Router();

// Ruta para iniciar sesión
router.post('/loginF', recibirIntentoFallido);

router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

export default router;
