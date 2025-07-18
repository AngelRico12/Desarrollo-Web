"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoriaController_1 = require("../controllers/categoriaController");
const categoriaController_2 = require("../controllers/categoriaController");
const categoriaController_3 = require("../controllers/categoriaController");
const categoriaController_4 = require("../controllers/categoriaController");
const categoriaController_5 = require("../controllers/categoriaController");
const categoriaController_6 = require("../controllers/categoriaController");
const categoriaController_7 = require("../controllers/categoriaController");
const router = (0, express_1.Router)();
// Ruta para obtener la categoría del equipo basado en el id_dt
router.get('/:id_dt', categoriaController_1.obtenerCategoriaPorDT);
router.get('/categoria-club/:id_usuario', categoriaController_1.obtenerCategoriaYClub);
router.get('/categoria-usuario/:nombreUsuario', categoriaController_2.obtenerCategoriaPorUsuario);
router.get('/id-equipo/:nombreUsuario', categoriaController_3.obtenerIdEquipoPorUsuario);
router.get('/Equipo/:nombreUsuario', categoriaController_4.verificarNombreUsuarioEnEquipo);
router.get('/estadoEquipo/:id', categoriaController_5.verificarEstadoEquipo);
router.get('/equipoCompleto/:id', categoriaController_6.validarJugadores);
router.get('/equipoXU/:nombreUsuario', categoriaController_7.obtenerEquipoPorUsuario);
exports.default = router;
