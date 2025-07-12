"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// utils/logger.ts
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Asegura que exista la carpeta logs
const logsDir = path_1.default.join(__dirname, '../../logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir);
}
const logger = winston_1.default.createLogger({
    level: 'info', // Puede ser 'debug', 'info', 'warn', 'error'
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json() // También puedes usar format.simple()
    ),
    transports: [
        new winston_1.default.transports.File({ filename: path_1.default.join(logsDir, 'error.log'), level: 'error' }),
        new winston_1.default.transports.File({ filename: path_1.default.join(logsDir, 'combined.log') }),
    ],
});
// También imprime en consola en desarrollo
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({ format: winston_1.default.format.simple() }));
}
exports.default = logger;
