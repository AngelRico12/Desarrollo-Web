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
exports.loginUsuario = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../database"));
const loginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, contraseña } = req.body;
    try {
        console.log('Credenciales recibidas:', correo, contraseña); // 👀 Verifica lo que llega
        const rows = yield database_1.default.query('SELECT id_usuario, nombre, correo, rol, id_club FROM usuario WHERE correo = ? AND contraseña = ?', [correo, contraseña]);
        if (rows.length > 0) {
            const usuario = rows[0];
            const token = jsonwebtoken_1.default.sign({
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                rol: usuario.rol,
                correo: usuario.correo,
                id_club: usuario.id_club, // ✅ Incluido correctamente
            }, process.env.JWT_SECRET, { expiresIn: '2h' });
            res.json({ success: true, token, usuario });
        }
        else {
            res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
        }
    }
    catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.loginUsuario = loginUsuario;
