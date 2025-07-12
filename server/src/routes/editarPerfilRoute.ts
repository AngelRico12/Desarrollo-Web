import express from 'express';
import {
  getClubInfo,
  updateClubInfo,
  requestClubDeletion,
} from '../controllers/editarPerfilController';
import { upload } from '../controllers/clubController'; // tu multer configurado

const router = express.Router();

router.get('/club/:id_club', getClubInfo);

router.put(
  '/club/:id_club',
  upload.fields([{ name: 'logotipo', maxCount: 1 }]),
  updateClubInfo
);

router.post('/club/:id_club/baja', requestClubDeletion);

export default router;
