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
exports.updateUsuario = exports.getUsuarioById = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../database"));
// Obtener usuario por ID
const getUsuarioById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield database_1.default.query('SELECT * FROM usuario WHERE id_usuario = ?', [id]);
        if (result.length === 0) {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            return;
        }
        const { id_usuario, nombre, correo, contraseña } = result[0];
        res.json({
            success: true,
            usuario: {
                id_usuario,
                nombre,
                correo,
                contrasena: contraseña, // opcional: usa 'contrasena' para front
            },
        });
    }
    catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});
exports.getUsuarioById = getUsuarioById;
// Actualizar usuario
const updateUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const campos = req.body;
    try {
        const camposPermitidos = ['nombre', 'correo', 'contrasena'];
        const camposActualizables = Object.keys(campos).filter(key => camposPermitidos.includes(key));
        if (camposActualizables.length === 0) {
            res.status(400).json({ success: false, message: 'No hay campos válidos para actualizar' });
            return;
        }
        const valores = [];
        for (const key of camposActualizables) {
            if (key === 'contrasena') {
                if (typeof campos[key] !== 'string' || campos[key].trim() === '') {
                    res.status(400).json({ success: false, message: 'Contraseña inválida' });
                    return;
                }
                const hash = yield bcryptjs_1.default.hash(campos[key], 10);
                valores.push(hash);
            }
            else {
                valores.push(campos[key]);
            }
        }
        const sql = `UPDATE usuario SET ${camposActualizables
            .map(k => (k === 'contrasena' ? 'contraseña = ?' : `${k} = ?`))
            .join(', ')} WHERE id_usuario = ?`;
        yield database_1.default.query(sql, [...valores, id]);
        res.json({ success: true, message: 'Campo(s) actualizado(s) correctamente' });
    }
    catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar perfil' });
    }
});
exports.updateUsuario = updateUsuario;
