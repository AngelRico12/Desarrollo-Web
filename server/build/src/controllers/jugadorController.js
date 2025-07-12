"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarJugador = exports.getJugadores = void 0;
const database_1 = __importDefault(require("../database"));
// Obtener todos los jugadores
const getJugadores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query('SELECT * FROM jugador');
        res.json({ success: true, jugadores: result });
    }
    catch (error) {
        console.error('Error al obtener jugadores:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});
exports.getJugadores = getJugadores;
// Eliminar jugador junto con sus folios
const eliminarJugador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Primero eliminar registros relacionados en folio_jugador
        yield database_1.default.query('DELETE FROM folio_jugador WHERE id_jugador = ?', [id]);
        // Luego eliminar el jugador
        yield database_1.default.query('DELETE FROM jugador WHERE id_jugador = ?', [id]);
        res.json({ success: true, message: 'Jugador y folios eliminados correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar jugador:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});
exports.eliminarJugador = eliminarJugador;
exports.default = {
    getJugadores: exports.getJugadores,
    eliminarJugador: exports.eliminarJugador
};
