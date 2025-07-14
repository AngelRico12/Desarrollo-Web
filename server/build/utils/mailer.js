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
exports.enviarAlertaCorreo = enviarAlertaCorreo;
// utils/mailer.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'mitsimy@gmail.com', // tu correo
        pass: 'nxkl umfw mmho geaa', // tu app password
    },
});
function enviarAlertaCorreo(destinatario, asunto, mensajeHTML) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailOptions = {
            from: 'mitsimy@gmail.com',
            to: destinatario,
            subject: asunto,
            html: mensajeHTML,
        };
        try {
            yield transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Error enviando correo de alerta:', error);
        }
    });
}
