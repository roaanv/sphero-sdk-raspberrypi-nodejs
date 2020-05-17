// external imports
import {Request, Response} from 'express';

// internal imports
import {RouterBase} from '../router-base';
import {IConfiguration} from '../../configuration';
import {IApiDal} from '../../modules/api-dal-interface';
import {DriveControl} from '../../modules/controls/v1.0/drive-control';


export class DriveControlRouter extends RouterBase {
    private static readonly _routerName: string = 'DriveControl';

    private readonly _driveControl: DriveControl;

    constructor(apiDal: IApiDal, configuration: IConfiguration) {
        super(DriveControlRouter._routerName, apiDal, configuration);
        this._driveControl = new DriveControl(apiDal);
    }

    protected initializeRoutes(): void {
        this.router.route('/driveControl/resetHeading')
            .put((request: Request, response: Response) => this.resetHeading(request, response));

        this.router.route('/driveControl/driveBackwardSeconds')
            .put((request: Request, response: Response) => this.driveBackwardSeconds(request, response));

        this.router.route('/driveControl/driveForwardSeconds')
            .put((request: Request, response: Response) => this.driveForwardSeconds(request, response));

        this.router.route('/driveControl/turnLeftDegrees')
            .put((request: Request, response: Response) => this.turnLeftDegrees(request, response));

        this.router.route('/driveControl/turnRightDegrees')
            .put((request: Request, response: Response) => this.turnRightDegrees(request, response));

        this.router.route('/driveControl/rollStart')
            .put((request: Request, response: Response) => this.rollStart(request, response));

        this.router.route('/driveControl/rollStop')
            .put((request: Request, response: Response) => this.rollStop(request, response));

        this.router.route('/driveControl/aimStart')
            .put((request: Request, response: Response) => this.aimStart(request, response));

        this.router.route('/driveControl/aimStop')
            .put((request: Request, response: Response) => this.aimStop(request, response));
    }

    public resetHeading(request: Request, response: Response) {
        try {
            this._driveControl.resetHeading();
            response.sendStatus(200);
        } catch(reason) {
            let errorCode: number = 400;
            let errorDetail: string = `Error in resetHeading: ${reason}`;

            // this.routeError(request.path, request.method, errorCode, errorDetail);

            response.status(errorCode).json({'error': errorDetail});
        }
    }

    public driveBackwardSeconds(request: Request, response: Response) {
        if (!request.body) {
            let errorCode: number = 400;
            let errorDetail: string = 'Payload is required!';

            response.status(errorCode).json({'error': errorDetail});

            return;
        }

        try {
            this._driveControl.driveBackwardSeconds(request.body.speed, request.body.heading, request.body.seconds);
            response.sendStatus(200);
        } catch(reason) {
            let errorCode: number = 400;
            let errorDetail: string = `Error in driveBackwardSeconds: ${reason}`;

            // this.routeError(request.path, request.method, errorCode, errorDetail);

            response.status(errorCode).json({'error': errorDetail});
        }
    }

    public driveForwardSeconds(request: Request, response: Response) {
        if (!request.body) {
            let errorCode: number = 400;
            let errorDetail: string = 'Payload is required!';

            response.status(errorCode).json({'error': errorDetail});

            return;
        }

        try {
            this._driveControl.driveForwardSeconds(request.body.speed, request.body.heading, request.body.seconds);
            response.sendStatus(200);
        } catch(reason) {
            let errorCode: number = 400;
            let errorDetail: string = `Error in driveForwardSeconds: ${reason}`;

            // this.routeError(request.path, request.method, errorCode, errorDetail);

            response.status(errorCode).json({'error': errorDetail});
        }
    }

    public turnLeftDegrees(request: Request, response: Response) {
        if (!request.body) {
            let errorCode: number = 400;
            let errorDetail: string = 'Payload is required!';

            response.status(errorCode).json({'error': errorDetail});

            return;
        }

        try {
            this._driveControl.turnLeftDegrees(request.body.heading, request.body.amount);
            response.sendStatus(200);
        } catch (reason) {
            let errorCode: number = 400;
            let errorDetail: string = `Error in turnLeftDegrees: ${reason}`;

            // this.routeError(request.path, request.method, errorCode, errorDetail);

            response.status(errorCode).json({'error': errorDetail});
        }
    }

    public turnRightDegrees(request: Request, response: Response) {
        if (!request.body) {
            let errorCode: number = 400;
            let errorDetail: string = 'Payload is required!';

            response.status(errorCode).json({'error': errorDetail});

            return;
        }

        try {
            this._driveControl.turnRightDegrees(request.body.heading, request.body.amount);
            response.sendStatus(200);
        } catch (reason) {
            let errorCode: number = 400;
            let errorDetail: string = `Error in turnRightDegrees: ${reason}`;

            // this.routeError(request.path, request.method, errorCode, errorDetail);

            response.status(errorCode).json({'error': errorDetail});
        }
    }

    public rollStart(request: Request, response: Response) {
        if (!request.body) {
            let errorCode: number = 400;
            let errorDetail: string = 'Payload is required!';

            response.status(errorCode).json({'error': errorDetail});
            return;
        }

        try {
            this._driveControl.rollStart(request.body.speed, request.body.heading);
            response.sendStatus(200);
        } catch (reason) {
            let errorCode: number = 400;
            let errorDetail: string = `Error in rollStart: ${reason}`;

            // this.routeError(request.path, request.method, errorCode, errorDetail);

            response.status(errorCode).json({'error': errorDetail});
        }

    }

    public rollStop(request: Request, response: Response) {
        if (!request.body) {
            let errorCode: number = 400;
            let errorDetail: string = 'Payload is required!';

            response.status(errorCode).json({'error': errorDetail});

            return;
        }

        try {
            this._driveControl.rollStop(request.body.heading);
            response.sendStatus(200);
        } catch (reason) {
            let errorCode: number = 400;
            let errorDetail: string = `Error in rollStop: ${reason}`;

            // this.routeError(request.path, request.method, errorCode, errorDetail);

            response.status(errorCode).json({'error': errorDetail});
        }
    }

    public aimStart(request: Request, response: Response) {
        try {
            this._driveControl.aimStart();
            response.sendStatus(200);
        } catch (reason) {
            let errorCode: number = 400;
            let errorDetail: string = `Error in aimStart: ${reason}`;

            // this.routeError(request.path, request.method, errorCode, errorDetail);

            response.status(errorCode).json({'error': errorDetail});
        }
    }

    public aimStop(request: Request, response: Response) {
        try {
            this._driveControl.aimStop();
            response.sendStatus(200);
        } catch (reason) {
            let errorCode: number = 400;
            let errorDetail: string = `Error in aimStop: ${reason}`;

            // this.routeError(request.path, request.method, errorCode, errorDetail);

            response.status(errorCode).json({'error': errorDetail});
        }

    }
}


