"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jugadorController_1 = __importDefault(require("../controllers/jugadorController"));
const router = (0, express_1.Router)();
router.get('/jugadores', jugadorController_1.default.getJugadores);
router.delete('/jugadores/:id', jugadorController_1.default.eliminarJugador);
exports.default = router;
