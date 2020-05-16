// external imports
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import {Server as HttpServer} from 'http';
import * as WebSocket from 'ws';
const swaggerUi = require('swagger-ui-express');

// internal imports
import apiRouter = require('../api/');
import {IConfiguration} from '../configuration';
import {createLogger, ILogger} from './logger';
import dateTimeUtilities = require('../utilities/date-time-utilities');
import {IApiDal} from './api-dal-interface';
import {IApiMessageLite} from '../models/api-message-lite';
import * as path from 'path';
import {buildSwaggerDoc} from '../utilities/merge-swagger-specs';
import {FirmwareVersionChecker} from './check-firmware-version';

let logger: ILogger = createLogger('app');


export class App {
    private _isInitialized: boolean = false;
    private _server: HttpServer;
    private _apiDal: IApiDal;
    private _configuration: IConfiguration;

    readonly expressApp: express.Application;

    constructor() {
        this.expressApp = express();
    }

    public initialize(server: HttpServer, apiDal: IApiDal, configuration: IConfiguration): void {
        if (this._isInitialized) {
            logger.warning('App has already been initialized!');
            return;
        }

        // TODO: validate args

        this._server = server;
        this._apiDal = apiDal;
        this._configuration = configuration;

        this.expressApp.locals.title = this._configuration.applicationTitle;

        this.initializeMiddleware();
        this.initializeRoutes();
        this.finalizeInitialization();

        let firmwareChecker: FirmwareVersionChecker = new FirmwareVersionChecker(this._apiDal);
        firmwareChecker.checkVersions();

        this._isInitialized = true;

        const wss = new WebSocket.Server({ server: this._server, path: this._configuration.webSocketPath, clientTracking: true});

        wss.on('connection', (ws: WebSocket) => {
            logger.info(`WebSocket client connected`);
            ws.on('message', (message: string) => {
                logger.info(`Client sent message -> ${message}`);
            });
        });

        this._apiDal.sendCommandToClientHandler = (message: IApiMessageLite): void => {
            wss.clients.forEach(client => {
                client.send(JSON.stringify(message));
            });
        };
    }

    private initializeMiddleware(): void {
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({extended: true}));
        this.expressApp.use(compression());
        this.expressApp.use(cors());
        this.expressApp.use(express.static(path.join(process.cwd(), 'public')));

        // more options --> https://github.com/scottie1984/swagger-ui-express
        let swaggerDocument: object = buildSwaggerDoc();
        const swaggerDocsRoute = `/api-docs`;
        this.expressApp.use(swaggerDocsRoute, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        logger.debug(`Route '${swaggerDocsRoute}' for swaggered docs registered successfully!`);

        // explore using this
        // https://github.com/expressjs/errorhandler

        this.expressApp.use(function (request: express.Request, response: express.Response, next: express.NextFunction) {
            let message = 'Request Received'
                + ' | Timestamp: ' + dateTimeUtilities.getDateAsString(new Date())
                + ' | IP: ' + request.ip
                + ' | URL: ' + request.url
                + ' | Path: ' + request.path
                + ' | Method: ' + request.method
                + ' | Protocol: ' + request.protocol
                + ' | IsSecure: ' + request.secure;

            // TODO: add query and params
            // TODO: can the response be logged here or where can that happen?

            logger.info(message);

            next();
        });

        this.expressApp.use((error: any, request: express.Request, response: express.Response, next: express.NextFunction) => {
            /*
            var err = new Error('Something went wrong');
            next(err);
            */

            logger.exception(error, 'An error occurred while handling a request.');

            this.routeErrorHandler(response, 'Unknown error occurred...', 'An unknown error has occurred!');
        });

        // TODO: add views / view engine
    }

    private initializeRoutes(): void {
        this.expressApp.get('/', function (request, response) {
            response.sendFile('index.html');
        });

        apiRouter.initializeRoutes(this.expressApp, this._apiDal, this._configuration);
        apiRouter.initializeCommandMappings(this.expressApp, this._apiDal, this._configuration);
    }

    private finalizeInitialization(): void {
        this.expressApp.all('*', function (request: express.Request, response: express.Response) {
            logger.error('Unknown route!');

            response.sendStatus(404);
        });
    }

    private routeErrorHandler(response: express.Response, reason: string, message: string, code?: number, error?: Error) {
        if (error) {
            logger.exception(error, reason);
        } else {
            logger.error(reason);
        }

        response.status(code || 500).json({'error': message});
    }
}
