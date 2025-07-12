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
exports.eliminarEquipo = exports.cambiarEstado = exports.getEquipos = void 0;
const database_1 = __importDefault(require("../database"));
// Obtener todos los equipos
const getEquipos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query('SELECT * FROM equipo');
        res.json({ success: true, equipos: result });
    }
    catch (error) {
        console.error('Error al obtener equipos:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});
exports.getEquipos = getEquipos;
// Cambiar el estado de un equipo
const cambiarEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { estado } = req.body;
    try {
        yield database_1.default.query('UPDATE equipo SET estado = ? WHERE id_equipo = ?', [estado, id]);
        res.json({ success: true, message: 'Estado actualizado correctamente' });
    }
    catch (error) {
        console.error('Error al cambiar estado del equipo:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});
exports.cambiarEstado = cambiarEstado;
// Eliminar un equipo por ID
const eliminarEquipo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // 1. Obtener los jugadores asociados al equipo
        const jugadores = yield database_1.default.query('SELECT id_jugador FROM jugador WHERE id_equipo = ?', [id]);
        // Extraemos los ids de jugadores
        const idsJugadores = jugadores.map((j) => j.id_jugador);
        if (idsJugadores.length > 0) {
            // 2. Eliminar de folio_jugador todos los registros vinculados a esos jugadores
            yield database_1.default.query('DELETE FROM folio_jugador WHERE id_jugador IN (?)', [idsJugadores]);
            // 3. Eliminar los jugadores vinculados al equipo
            yield database_1.default.query('DELETE FROM jugador WHERE id_equipo = ?', [id]);
        }
        // 4. Finalmente eliminar el equipo
        yield database_1.default.query('DELETE FROM equipo WHERE id_equipo = ?', [id]);
        res.json({ success: true, message: 'Equipo y registros relacionados eliminados correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar equipo:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});
exports.eliminarEquipo = eliminarEquipo;
