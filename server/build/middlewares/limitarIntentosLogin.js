"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitarIntentosLogin = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.limitarIntentosLogin = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 5,
    handler: (req, res) => {
        console.log(`IP bloqueada: ${req.ip}`);
        res.status(429).json({ success: false, message: 'Demasiados intentos, intente más tarde.' });
    },
    standardHeaders: true,
    legacyHeaders: false,
});
