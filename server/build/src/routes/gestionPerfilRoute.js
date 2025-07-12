"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gestionPerfil_1 = require("../controllers/gestionPerfil");
const router = (0, express_1.Router)();
router.get('/:id', gestionPerfil_1.getUsuarioById);
router.put('/:id', gestionPerfil_1.updateUsuario);
exports.default = router;
