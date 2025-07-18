"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const serve_index_1 = __importDefault(require("serve-index"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const clubRoutes_1 = __importDefault(require("./routes/clubRoutes"));
const UsuarioRoutes_1 = __importDefault(require("./routes/UsuarioRoutes"));
const AdminRoute_1 = __importDefault(require("./routes/AdminRoute"));
const EquipoDTRoute_1 = __importDefault(require("./routes/EquipoDTRoute"));
const clubesRoutes_1 = __importDefault(require("./routes/clubesRoutes"));
const categoriaRoute_1 = __importDefault(require("./routes/categoriaRoute"));
const EquipoJugadorRoute_1 = __importDefault(require("./routes/EquipoJugadorRoute"));
const recuperaContraRoute_1 = __importDefault(require("./routes/recuperaContraRoute"));
const gestionPerfilRoute_1 = __importDefault(require("./routes/gestionPerfilRoute"));
const equipoRoutes_1 = __importDefault(require("./routes/equipoRoutes"));
const jugadorRoutes_1 = __importDefault(require("./routes/jugadorRoutes"));
const editarPerfilRoute_1 = __importDefault(require("./routes/editarPerfilRoute"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)('dev'));
        // Seguridad HTTP headers con helmet
        this.app.use((0, helmet_1.default)());
        // CORS para localhost HTTPS en puertos 3000 y 4200
        this.app.use((0, cors_1.default)({
            origin: [
                'https://localhost:3000',
                'https://localhost:4200'
            ],
            optionsSuccessStatus: 200
        }));
        // Limitar tamaño de payload JSON y urlencoded
        this.app.use(express_1.default.json({ limit: '10kb' }));
        this.app.use(express_1.default.urlencoded({ extended: false, limit: '10kb' }));
        // Rate limiting para evitar ataques DoS
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000, // 15 minutos
            max: 100, // máximo 100 peticiones por IP
            standardHeaders: true,
            legacyHeaders: false,
            message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
        });
        this.app.use(limiter);
        const uploadsPath = path_1.default.join(__dirname, '../uploads');
        this.app.use('/uploads', express_1.default.static(uploadsPath), (0, serve_index_1.default)(uploadsPath, { icons: true }));
    }
    routes() {
        this.app.use('/', indexRoutes_1.default);
        this.app.use('/api/auth', UsuarioRoutes_1.default);
        this.app.use('/api/log', authRoutes_1.default);
        this.app.use('/api/club', clubRoutes_1.default);
        this.app.use('/api/Admin', AdminRoute_1.default);
        this.app.use('/api/team', EquipoDTRoute_1.default);
        this.app.use('/api/clubes', clubesRoutes_1.default);
        this.app.use('/api/Ecategoria', categoriaRoute_1.default);
        this.app.use('/api/juga', EquipoJugadorRoute_1.default);
        this.app.use('/api/recupera', recuperaContraRoute_1.default);
        this.app.use('/api/perfil', gestionPerfilRoute_1.default);
        this.app.use('/api/equipos', equipoRoutes_1.default);
        this.app.use('/api/jugadores', jugadorRoutes_1.default);
        this.app.use('/api/club2', editarPerfilRoute_1.default);
    }
    start() {
        const privateKey = fs_1.default.readFileSync(path_1.default.join(__dirname, '../server.key'), 'utf8');
        const certificate = fs_1.default.readFileSync(path_1.default.join(__dirname, '../server.cert'), 'utf8');
        const credentials = { key: privateKey, cert: certificate };
        const httpsServer = https_1.default.createServer(credentials, this.app);
        httpsServer.listen(this.app.get('port'), () => {
            console.log('Servidor HTTPS corriendo en puerto', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
