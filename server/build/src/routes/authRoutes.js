"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empleadoController_1 = require("../controllers/empleadoController");
const router = (0, express_1.Router)();
// Ruta para iniciar sesión
router.post('/loginF', empleadoController_1.recibirIntentoFallido);
router.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});
exports.default = router;
