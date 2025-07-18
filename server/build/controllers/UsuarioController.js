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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = __importDefault(require("../utils/logger"));
const mailer_1 = require("../utils/mailer");
const loginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, contraseña } = req.body;
    try {
        const rows = yield database_1.default.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
        if (rows.length === 0) {
            logger_1.default.warn('Intento de login fallido: correo no registrado', { correo, ip: req.ip });
            res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
            return;
        }
        const usuario = rows[0];
        if (usuario.bloqueado_hasta && new Date(usuario.bloqueado_hasta) > new Date()) {
            logger_1.default.warn('Intento de acceso a cuenta bloqueada', {
                correo: usuario.correo,
                bloqueado_hasta: usuario.bloqueado_hasta,
                ip: req.ip
            });
            res.status(403).json({
                success: false,
                message: `Tu cuenta está bloqueada hasta las ${usuario.bloqueado_hasta.toLocaleString()}`
            });
            return;
        }
        const contraseñaValida = yield bcryptjs_1.default.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            const nuevosIntentos = usuario.intentos_fallidos + 1;
            if (nuevosIntentos >= 5) {
                yield database_1.default.query(`UPDATE usuario 
           SET intentos_fallidos = ?, bloqueado_hasta = DATE_ADD(NOW(), INTERVAL 15 MINUTE) 
           WHERE id_usuario = ?`, [nuevosIntentos, usuario.id_usuario]);
                logger_1.default.warn('Cuenta bloqueada por intentos fallidos', {
                    correo: usuario.correo,
                    ip: req.ip,
                    intentos_fallidos: nuevosIntentos
                });
                // Enviar alerta por correo
                yield (0, mailer_1.enviarAlertaCorreo)('angelrico122001@gmail.com', // pon aquí tu correo de administrador o seguridad
                `Alerta: Cuenta bloqueada - usuario ${usuario.correo}`, `<p>La cuenta con correo <b>${usuario.correo}</b> ha sido bloqueada por ${nuevosIntentos} intentos fallidos consecutivos.</p>
           <p>IP: ${req.ip}</p>
           <p>Fecha: ${new Date().toLocaleString()}</p>`);
                res.status(403).json({
                    success: false,
                    message: 'Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.'
                });
                return;
            }
            else {
                yield database_1.default.query(`UPDATE usuario SET intentos_fallidos = ? WHERE id_usuario = ?`, [nuevosIntentos, usuario.id_usuario]);
            }
            logger_1.default.warn('Contraseña incorrecta', {
                correo: usuario.correo,
                ip: req.ip,
                intentos_fallidos: nuevosIntentos
            });
            res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
            return;
        }
        // Login exitoso: limpia los intentos y actualiza ultima_sesion
        yield database_1.default.query(`UPDATE usuario SET intentos_fallidos = 0, bloqueado_hasta = NULL, ultima_sesion = NOW() WHERE id_usuario = ?`, [usuario.id_usuario]);
        const token = jsonwebtoken_1.default.sign({
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            rol: usuario.rol,
            correo: usuario.correo,
            id_club: usuario.id_club,
        }, process.env.JWT_SECRET, { expiresIn: '600s' });
        delete usuario.contraseña;
        logger_1.default.info('Login exitoso', {
            id_usuario: usuario.id_usuario,
            correo: usuario.correo,
            ip: req.ip
        });
        res.json({ success: true, token, usuario });
    }
    catch (error) {
        logger_1.default.error('Error en el login', { error, correo, ip: req.ip });
        res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.loginUsuario = loginUsuario;
