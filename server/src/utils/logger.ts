// utils/logger.ts
import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Asegura que exista la carpeta logs
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logger = winston.createLogger({
  level: 'info', // Puede ser 'debug', 'info', 'warn', 'error'
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // También puedes usar format.simple()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logsDir, 'combined.log') }),
  ],
});

// También imprime en consola en desarrollo
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

export default logger;
