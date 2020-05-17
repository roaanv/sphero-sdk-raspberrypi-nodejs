// external imports
import {Application} from 'express';

// internal imports
import {createLogger, ILogger} from '../../modules/logger';
import {IConfiguration} from '../../configuration';

// route imports
import {IApiDal} from '../../modules/api-dal-interface';
import {DriveControlRouter} from './drive-control-router';
import {InfraredControlRouter} from './infrared-control-router';
import {LedControlRouter} from './led-control-router';
import {SensorStreamingControlRouter} from './sensor-streaming-control-router';
import {RouterBase} from '../router-base';

let logger: ILogger = createLogger('api index');


export function initializeRoutes(app: Application, apiDal: IApiDal, configuration: IConfiguration): void {
    logger.debug('Initializing API v1.0 Controller routes');

    initializeRoute(app, new LedControlRouter(apiDal, configuration));
    initializeRoute(app, new InfraredControlRouter(apiDal, configuration));
    initializeRoute(app, new DriveControlRouter(apiDal, configuration));
    initializeRoute(app, new SensorStreamingControlRouter(apiDal, configuration));
}

function initializeRoute(app: Application, controlRouter: RouterBase) {
    controlRouter.initialize();
    app.use('/api/v1.0/', controlRouter.router);
}
