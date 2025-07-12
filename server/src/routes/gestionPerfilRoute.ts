import { Router } from 'express';
import { getUsuarioById, updateUsuario } from '../controllers/gestionPerfil';

const router = Router();



router.get('/:id', getUsuarioById);
router.put('/:id', updateUsuario);

export default router;
