"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioController_1 = require("../controllers/UsuarioController");
const router = (0, express_1.Router)();
// Ruta para iniciar sesión
router.post('/login', UsuarioController_1.loginUsuario);
// Ruta para intento fallido
router.post('/loginF', UsuarioController_1.recibirIntentoFallido);
exports.default = router;
