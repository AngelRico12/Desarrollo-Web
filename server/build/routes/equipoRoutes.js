"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const equipoController_1 = require("../controllers/equipoController");
const router = (0, express_1.Router)();
router.get('/equipos', equipoController_1.getEquipos);
router.put('/equipos/:id/estado', equipoController_1.cambiarEstado);
router.delete('/equipos/:id', equipoController_1.eliminarEquipo);
exports.default = router;
