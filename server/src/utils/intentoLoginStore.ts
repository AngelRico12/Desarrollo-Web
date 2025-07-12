// Este módulo mantiene el estado en memoria mientras el servidor esté vivo
const intentosFallidos = new Map<string, { count: number; timeout?: NodeJS.Timeout }>();

export default intentosFallidos;
