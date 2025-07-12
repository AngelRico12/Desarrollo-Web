"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Este módulo mantiene el estado en memoria mientras el servidor esté vivo
const intentosFallidos = new Map();
exports.default = intentosFallidos;
