"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarLogin = void 0;
// middlewares/validarLogin.ts
const express_validator_1 = require("express-validator");
const validarLogin = () => {
    return [
        (0, express_validator_1.body)('correo').isEmail().withMessage('Correo inválido'),
        (0, express_validator_1.body)('contraseña').notEmpty().withMessage('Contraseña requerida'),
        // ✅ Esta función ahora solo retorna void
        (req, res, next) => {
            const errores = (0, express_validator_1.validationResult)(req);
            if (!errores.isEmpty()) {
                res.status(400).json({ success: false, errores: errores.array() });
                return; // ✅ Detiene ejecución para evitar pasar a next()
            }
            next();
        }
    ];
};
exports.validarLogin = validarLogin;
