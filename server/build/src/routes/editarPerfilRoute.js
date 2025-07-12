"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const editarPerfilController_1 = require("../controllers/editarPerfilController");
const clubController_1 = require("../controllers/clubController"); // tu multer configurado
const router = express_1.default.Router();
router.get('/club/:id_club', editarPerfilController_1.getClubInfo);
router.put('/club/:id_club', clubController_1.upload.fields([{ name: 'logotipo', maxCount: 1 }]), editarPerfilController_1.updateClubInfo);
router.post('/club/:id_club/baja', editarPerfilController_1.requestClubDeletion);
exports.default = router;
