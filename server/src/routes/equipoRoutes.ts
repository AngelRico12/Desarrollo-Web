import { Router } from 'express';
import { getEquipos, cambiarEstado, eliminarEquipo } from '../controllers/equipoController';

const router = Router();

router.get('/equipos', getEquipos);
router.put('/equipos/:id/estado', cambiarEstado);
router.delete('/equipos/:id', eliminarEquipo);

export default router;
