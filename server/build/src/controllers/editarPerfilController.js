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
exports.requestClubDeletion = exports.updateClubInfo = exports.getClubInfo = void 0;
const database_1 = __importDefault(require("../database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const path_1 = __importDefault(require("path"));
const getClubInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_club } = req.params;
    const id = Number(id_club);
    try {
        const clubRows = yield database_1.default.query('SELECT * FROM club WHERE id_club = ?', [id]);
        const equipoRows = yield database_1.default.query('SELECT * FROM equipo WHERE id_club = ?', [id]);
        const usuarioRows = yield database_1.default.query('SELECT * FROM usuario WHERE id_club = ? AND rol = "administrador_equipo" LIMIT 1', [id]);
        if (!Array.isArray(clubRows) || clubRows.length === 0) {
            res.status(404).json({ success: false, message: 'Club no encontrado.' });
            return;
        }
        res.json({
            success: true,
            club: clubRows[0],
            equipo: equipoRows[0] || null,
            usuario: usuarioRows.find((u) => u.rol === 'administrador_equipo') || null,
        });
    }
    catch (error) {
        console.error('Error al obtener datos del club:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});
exports.getClubInfo = getClubInfo;
const updateClubInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id_club } = req.params;
    const { nombre, correo, contraseña } = req.body;
    const files = req.files;
    try {
        const [clubRows] = yield database_1.default.query('SELECT * FROM club WHERE id_club = ?', [id_club]);
        if (!Array.isArray(clubRows) || clubRows.length === 0) {
            res.status(404).json({ success: false, message: 'Club no encontrado.' });
            return;
        }
        const updatesClub = [];
        const valuesClub = [];
        const updatesUsuario = [];
        const valuesUsuario = [];
        const updatesEquipo = [];
        const valuesEquipo = [];
        // --- Nombre ---
        if (nombre) {
            updatesClub.push('nombre = ?');
            valuesClub.push(nombre);
            updatesUsuario.push('nombre = ?');
            valuesUsuario.push(nombre);
            updatesEquipo.push('nombre = ?');
            valuesEquipo.push(nombre);
        }
        // --- Correo ---
        if (correo) {
            updatesClub.push('correo = ?');
            valuesClub.push(correo);
            updatesUsuario.push('correo = ?');
            valuesUsuario.push(correo);
        }
        // --- Logotipo ---
        if ((_a = files === null || files === void 0 ? void 0 : files['logotipo']) === null || _a === void 0 ? void 0 : _a[0]) {
            const logotipoPath = '/' + files['logotipo'][0].path.replace(path_1.default.join(__dirname, '../../'), '').replace(/\\/g, '/');
            updatesClub.push('logotipo = ?');
            valuesClub.push(logotipoPath);
        }
        // --- Contraseña ---
        if (contraseña) {
            const hashedPassword = yield bcryptjs_1.default.hash(contraseña, 10);
            updatesUsuario.push('contraseña = ?');
            valuesUsuario.push(hashedPassword);
        }
        // --- Ejecutar actualizaciones solo si hay algo que actualizar ---
        if (updatesClub.length > 0) {
            yield database_1.default.query(`UPDATE club SET ${updatesClub.join(', ')} WHERE id_club = ?`, [...valuesClub, id_club]);
        }
        if (updatesEquipo.length > 0) {
            yield database_1.default.query(`UPDATE equipo SET ${updatesEquipo.join(', ')} WHERE id_club = ?`, [...valuesEquipo, id_club]);
        }
        if (updatesUsuario.length > 0) {
            yield database_1.default.query(`UPDATE usuario SET ${updatesUsuario.join(', ')} WHERE id_club = ? AND rol = "administrador_equipo"`, [...valuesUsuario, id_club]);
        }
        res.json({ success: true, message: 'Información actualizada correctamente.' });
    }
    catch (error) {
        console.error('Error al actualizar información:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});
exports.updateClubInfo = updateClubInfo;
const requestClubDeletion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_club } = req.params;
    try {
        // Aquí podrías marcar como 'pendiente_baja' o eliminar directamente según tu lógica
        yield database_1.default.query('UPDATE club SET estado = ? WHERE id_club = ?', ['pendiente_baja', id_club]);
        res.json({
            success: true,
            message: 'Solicitud de baja enviada. El club será eliminado tras revisión.',
        });
    }
    catch (error) {
        console.error('Error al solicitar baja:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});
exports.requestClubDeletion = requestClubDeletion;
