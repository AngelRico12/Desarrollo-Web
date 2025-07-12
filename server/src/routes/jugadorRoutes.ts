import { Router } from 'express';
import jugadorController from '../controllers/jugadorController';

const router = Router();

router.get('/jugadores', jugadorController.getJugadores);
router.delete('/jugadores/:id', jugadorController.eliminarJugador);

export default router;
