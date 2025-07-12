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
exports.recibirIntentoFallido = exports.loginUsuario = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const loginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, contraseña } = req.body;
    try {
        const rows = yield database_1.default.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
        if (rows.length === 0) {
            // ❌ El correo no existe
            res.status(401).json({
                success: false,
                message: 'Correo o contraseña incorrectos',
                correoIntentado: correo
            });
            return;
        }
        const usuario = rows[0];
        const contraseñaValida = yield bcryptjs_1.default.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            // ❌ Contraseña incorrecta
            res.status(401).json({
                success: false,
                message: 'Correo o contraseña incorrectos',
                correoIntentado: correo
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            rol: usuario.rol,
            correo: usuario.correo,
            id_club: usuario.id_club,
        }, process.env.JWT_SECRET, { expiresIn: '600s' });
        delete usuario.contraseña;
        res.json({ success: true, token, usuario });
    }
    catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.loginUsuario = loginUsuario;
const recibirIntentoFallido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, ip } = req.body;
    console.log('📥 Intento fallido recibido');
    console.log('Correo intentado:', correo);
    console.log('IP del cliente:', ip || req.ip);
    // Puedes responder algo sencillo
    res.status(200).json({ success: true, message: 'Intento fallido recibido correctamente' });
});
exports.recibirIntentoFallido = recibirIntentoFallido;
