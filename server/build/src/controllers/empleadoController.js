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
Object.defineProperty(exports, "__esModule", { value: true });
exports.recibirIntentoFallido = void 0;
const recibirIntentoFallido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, ip } = req.body;
    console.log('📥 Intento fallido recibido');
    console.log('Correo intentado:', correo);
    console.log('IP del cliente:', ip || req.ip);
    // Puedes responder algo sencillo
    res.status(200).json({ success: true, message: 'Intento fallido recibido correctamente' });
});
exports.recibirIntentoFallido = recibirIntentoFallido;
