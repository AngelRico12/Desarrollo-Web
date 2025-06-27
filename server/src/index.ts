import express from 'express';
import path from 'path';
import serveIndex from 'serve-index';
import morgan from 'morgan';
import cors from 'cors';

import indexRoutes from './routes/indexRoutes';
import authRoutes from './routes/authRoutes'; // Importar las rutas de autenticación
import clubRoutes from './routes/clubRoutes';
import UsuarioRoutes from './routes/UsuarioRoutes';
import AdminRoute from './routes/AdminRoute';
import EquipoDTRoute from './routes/EquipoDTRoute';
import ClubesRoutes from './routes/clubesRoutes';
import categoriaRoute from './routes/categoriaRoute';
import EquipoJugadorRoute from './routes/EquipoJugadorRoute';
import recuperaContraRoute from './routes/recuperaContraRoute';

import gestionPerfilRoute from './routes/gestionPerfilRoute';

import equipoRoutes from './routes/equipoRoutes';

import jugadorRoutes from './routes/jugadorRoutes';

import dotenv from 'dotenv';
dotenv.config();


class Server {
    private app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    private config(): void {
        // Configuración general
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        // Hacer pública la carpeta uploads y habilitar listado de directorios
        const uploadsPath = path.join(__dirname, '../uploads');
        this.app.use('/uploads', express.static(uploadsPath), serveIndex(uploadsPath, { icons: true }));
    }

    private routes(): void {
        // Configuración de rutas
        this.app.use('/', indexRoutes);
        this.app.use('/api/auth', UsuarioRoutes); // Añadir la ruta de autenticación
        this.app.use('/api/club', clubRoutes);
        this.app.use('/api/Usuario', UsuarioRoutes);
        this.app.use('/api/Admin', AdminRoute);
        this.app.use('/api/team', EquipoDTRoute);
        this.app.use('/api/clubes', ClubesRoutes);
        this.app.use('/api/Ecategoria', categoriaRoute);
        this.app.use('/api/juga', EquipoJugadorRoute);
        this.app.use('/api/recupera', recuperaContraRoute);
        this.app.use('/api/perfil', gestionPerfilRoute);
        this.app.use('/api/equipos', equipoRoutes);
        this.app.use('/api/jugadores', jugadorRoutes)

    }

    public start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();