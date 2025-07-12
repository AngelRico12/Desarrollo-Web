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
const database_1 = __importDefault(require("../database"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = require("crypto");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class ClubController {
    // Listar solicitudes de clubes
    static listarSolicitudes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const solicitudes = yield database_1.default.query('SELECT * FROM club WHERE estado = ?', ['pendiente']);
                solicitudes.forEach((club) => {
                    club.certificado = `http://localhost:3000${club.certificado.replace(/\\/g, '/')}`;
                    club.logotipo = `http://localhost:3000${club.logotipo.replace(/\\/g, '/')}`;
                });
                res.status(200).json(solicitudes);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error al obtener las solicitudes de clubes.' });
            }
        });
    }
    // Aprobar un club y crear el usuario administrador del equipo
    static aprobarClub(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_club } = req.params;
            let connection;
            try {
                connection = yield database_1.default.getConnection();
                yield connection.beginTransaction();
                const club = yield connection.query('SELECT * FROM club WHERE id_club = ?', [id_club]);
                if (!club || club.length === 0) {
                    res.status(404).json({ message: 'Club no encontrado.' });
                    return;
                }
                const { nombre, correo } = club[0];
                const contraseña = (0, crypto_1.randomBytes)(8).toString('hex');
                const hashedPassword = yield bcryptjs_1.default.hash(contraseña, 10); // 🔐 Encriptar la contraseña
                yield connection.query('INSERT INTO usuario (nombre, correo, contraseña, rol, id_club) VALUES (?, ?, ?, ?, ?)', [nombre, correo, hashedPassword, 'administrador_equipo', id_club]);
                yield connection.query('UPDATE club SET estado = ? WHERE id_club = ?', ['aprobado', id_club]);
                yield connection.commit();
                connection.release();
                yield ClubController.enviarCorreo(correo, contraseña);
                res.status(200).json({ message: 'Club aprobado y usuario administrador creado.' });
            }
            catch (error) {
                console.error(error);
                if (connection)
                    yield connection.rollback();
                res.status(500).json({ message: 'Error al aprobar el club.' });
            }
        });
    }
    // Eliminar un club
    static eliminarClub(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_club } = req.params;
            try {
                const result = yield database_1.default.query('DELETE FROM club WHERE id_club = ?', [id_club]);
                if (result.affectedRows === 0) {
                    res.status(404).json({ message: 'Club no encontrado.' });
                    return;
                }
                res.status(200).json({ message: 'Club eliminado correctamente.' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error al eliminar el club.' });
            }
        });
    }
    // Enviar correo con la contraseña generada
    static enviarCorreo(correo, contraseña) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: 'mitsimy@gmail.com', // Cambiar por tu correo real
                    pass: 'nxkl umfw mmho geaa', // Cambiar por tu contraseña real o app password
                },
            });
            const mensaje = {
                from: 'mitsimy@gmail.com',
                to: correo,
                subject: 'Cuenta de Administrador de Equipo Creada',
                html: `
        <h2>Bienvenido a la plataforma</h2>
        <p>Su cuenta de administrador de equipo ha sido creada con éxito. Aquí están sus credenciales:</p>
        <ul>
          <li><b>Correo:</b> ${correo}</li>
          <li><b>Contraseña:</b> ${contraseña}</li>
        </ul>
        <p>Por favor, cambie su contraseña después de iniciar sesión.</p>
      `,
            };
            yield transporter.sendMail(mensaje);
        });
    }
}
exports.default = ClubController;
