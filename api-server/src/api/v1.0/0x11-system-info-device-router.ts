// ************************************************************
// This file was automatically generated!
// Device ID (DID):         0x11
// Device Name:             system_info
// Device Description:      
// Command Count:           8
// Source File:             0x11-system_info.json
// ************************************************************

// external imports
import {Request, Response} from 'express';

// internal imports
import {DeviceRouterBase} from '../device-router-base';
import {IApiCommandMessage, buildApiCommandMessageWithDefaultFlags, buildApiCommandMessageWithNoResponseDefaultFlags} from '../../models/api-command-message';
import {IApiResponseMessage} from '../../models/api-response-message';
import {IConfiguration} from '../../configuration';
import {IApiDal} from '../../modules/api-dal-interface';
import {ByteConversionUtilities} from '../../utilities/byte-conversion-utilities'
import {ApiTargetsAndSources} from '../../constants';

// command parsers
import {
    parseGetMainApplicationVersionResponse,
    IGetMainApplicationVersionResponse
} from './command-parsers/0x11-system-info/0x00-get-main-application-version-command-parser'
import {
    parseGetBootloaderVersionResponse,
    IGetBootloaderVersionResponse
} from './command-parsers/0x11-system-info/0x01-get-bootloader-version-command-parser'
import {
    parseGetBoardRevisionResponse,
    IGetBoardRevisionResponse
} from './command-parsers/0x11-system-info/0x03-get-board-revision-command-parser'
import {
    parseGetMacAddressResponse,
    IGetMacAddressResponse
} from './command-parsers/0x11-system-info/0x06-get-mac-address-command-parser'
import {
    parseGetStatsIdResponse,
    IGetStatsIdResponse
} from './command-parsers/0x11-system-info/0x13-get-stats-id-command-parser'
import {
    parseGetProcessorNameResponse,
    IGetProcessorNameResponse
} from './command-parsers/0x11-system-info/0x1F-get-processor-name-command-parser'
import {
    parseGetSkuResponse,
    IGetSkuResponse
} from './command-parsers/0x11-system-info/0x38-get-sku-command-parser'
import {
    parseGetCoreUpTimeInMillisecondsResponse,
    IGetCoreUpTimeInMillisecondsResponse
} from './command-parsers/0x11-system-info/0x39-get-core-up-time-in-milliseconds-command-parser'


export class SystemInfoDeviceRouter extends DeviceRouterBase {
    private static readonly _deviceId: number = 0x11;
    private static readonly _deviceName: string = 'SystemInfo (0x11)';
    
    constructor(apiDal: IApiDal, configuration: IConfiguration) {
        super(SystemInfoDeviceRouter._deviceName, apiDal, configuration, SystemInfoDeviceRouter._deviceId);
    }
    
    protected initializeRoutes(): void {
        this.router.route('/systemInfo/getMainApplicationVersion/:targetId')
            .get((request: Request, response: Response) =>
                this.getMainApplicationVersion(request, response));
        this.registerCommand(0x00, 'GetMainApplicationVersion');
        
        this.router.route('/systemInfo/getBootloaderVersion/:targetId')
            .get((request: Request, response: Response) =>
                this.getBootloaderVersion(request, response));
        this.registerCommand(0x01, 'GetBootloaderVersion');
        
        this.router.route('/systemInfo/getBoardRevision/:targetId')
            .get((request: Request, response: Response) =>
                this.getBoardRevision(request, response));
        this.registerCommand(0x03, 'GetBoardRevision');
        
        this.router.route('/systemInfo/getMacAddress/:targetId')
            .get((request: Request, response: Response) =>
                this.getMacAddress(request, response));
        this.registerCommand(0x06, 'GetMacAddress');
        
        this.router.route('/systemInfo/getStatsId/:targetId')
            .get((request: Request, response: Response) =>
                this.getStatsId(request, response));
        this.registerCommand(0x13, 'GetStatsId');
        
        this.router.route('/systemInfo/getProcessorName/:targetId')
            .get((request: Request, response: Response) =>
                this.getProcessorName(request, response));
        this.registerCommand(0x1F, 'GetProcessorName');
        
        this.router.route('/systemInfo/getSku/:targetId')
            .get((request: Request, response: Response) =>
                this.getSku(request, response));
        this.registerCommand(0x38, 'GetSku');
        
        this.router.route('/systemInfo/getCoreUpTimeInMilliseconds/:targetId')
            .get((request: Request, response: Response) =>
                this.getCoreUpTimeInMilliseconds(request, response));
        this.registerCommand(0x39, 'GetCoreUpTimeInMilliseconds');
    }
    
    public getMainApplicationVersion(request: Request, response: Response) {
        // DID: 0x11 | CID: 0x00 | TID(s): 1, 2
        
        let commandId: number = 0x00;
        let commandName: string = this.getCommandName(commandId);
        
        if (!request.params.targetId) {
            let errorCode: number = 400;
            let errorDetail: string = 'targetId is required!';
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
            
            return;
        }
        
        // No inputs...
        
        let targetId: number = ByteConversionUtilities.nibblesToByte([1, parseInt(request.params.targetId)].reverse());
        let sourceId: number = ApiTargetsAndSources.serviceSource;
        
        this.logRequest(request.path, request.method,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            sourceId, targetId,
            ''
        );
        
        let apiCommandMessage: IApiCommandMessage = buildApiCommandMessageWithDefaultFlags(
            targetId, ApiTargetsAndSources.serviceSource,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            null
        );
        
        apiCommandMessage.generateMessageRawBytes();
        this._apiDal.sendApiCommandMessage(apiCommandMessage).then(apiResponseMessage => {
            let responsePayload: IGetMainApplicationVersionResponse = parseGetMainApplicationVersionResponse(apiResponseMessage.dataRawBytes);
            
            this.logResponse(request.path, request.method,
                SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
                commandId, commandName,
                sourceId, targetId,
                JSON.stringify(responsePayload)
            );
            
            response.status(200).json(responsePayload);
        }).catch(reason => {
            let errorCode: number = 400;
            let errorDetail: string = `Error in getMainApplicationVersion while sending API Command: ${reason}`;
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
        });
    }
    
    public getBootloaderVersion(request: Request, response: Response) {
        // DID: 0x11 | CID: 0x01 | TID(s): 1, 2
        
        let commandId: number = 0x01;
        let commandName: string = this.getCommandName(commandId);
        
        if (!request.params.targetId) {
            let errorCode: number = 400;
            let errorDetail: string = 'targetId is required!';
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
            
            return;
        }
        
        // No inputs...
        
        let targetId: number = ByteConversionUtilities.nibblesToByte([1, parseInt(request.params.targetId)].reverse());
        let sourceId: number = ApiTargetsAndSources.serviceSource;
        
        this.logRequest(request.path, request.method,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            sourceId, targetId,
            ''
        );
        
        let apiCommandMessage: IApiCommandMessage = buildApiCommandMessageWithDefaultFlags(
            targetId, ApiTargetsAndSources.serviceSource,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            null
        );
        
        apiCommandMessage.generateMessageRawBytes();
        this._apiDal.sendApiCommandMessage(apiCommandMessage).then(apiResponseMessage => {
            let responsePayload: IGetBootloaderVersionResponse = parseGetBootloaderVersionResponse(apiResponseMessage.dataRawBytes);
            
            this.logResponse(request.path, request.method,
                SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
                commandId, commandName,
                sourceId, targetId,
                JSON.stringify(responsePayload)
            );
            
            response.status(200).json(responsePayload);
        }).catch(reason => {
            let errorCode: number = 400;
            let errorDetail: string = `Error in getBootloaderVersion while sending API Command: ${reason}`;
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
        });
    }
    
    public getBoardRevision(request: Request, response: Response) {
        // DID: 0x11 | CID: 0x03 | TID(s): 1
        
        let commandId: number = 0x03;
        let commandName: string = this.getCommandName(commandId);
        
        if (!request.params.targetId) {
            let errorCode: number = 400;
            let errorDetail: string = 'targetId is required!';
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
            
            return;
        }
        
        // No inputs...
        
        let targetId: number = ByteConversionUtilities.nibblesToByte([1, parseInt(request.params.targetId)].reverse());
        let sourceId: number = ApiTargetsAndSources.serviceSource;
        
        this.logRequest(request.path, request.method,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            sourceId, targetId,
            ''
        );
        
        let apiCommandMessage: IApiCommandMessage = buildApiCommandMessageWithDefaultFlags(
            targetId, ApiTargetsAndSources.serviceSource,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            null
        );
        
        apiCommandMessage.generateMessageRawBytes();
        this._apiDal.sendApiCommandMessage(apiCommandMessage).then(apiResponseMessage => {
            let responsePayload: IGetBoardRevisionResponse = parseGetBoardRevisionResponse(apiResponseMessage.dataRawBytes);
            
            this.logResponse(request.path, request.method,
                SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
                commandId, commandName,
                sourceId, targetId,
                JSON.stringify(responsePayload)
            );
            
            response.status(200).json(responsePayload);
        }).catch(reason => {
            let errorCode: number = 400;
            let errorDetail: string = `Error in getBoardRevision while sending API Command: ${reason}`;
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
        });
    }
    
    public getMacAddress(request: Request, response: Response) {
        // DID: 0x11 | CID: 0x06 | TID(s): 1
        
        let commandId: number = 0x06;
        let commandName: string = this.getCommandName(commandId);
        
        if (!request.params.targetId) {
            let errorCode: number = 400;
            let errorDetail: string = 'targetId is required!';
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
            
            return;
        }
        
        // No inputs...
        
        let targetId: number = ByteConversionUtilities.nibblesToByte([1, parseInt(request.params.targetId)].reverse());
        let sourceId: number = ApiTargetsAndSources.serviceSource;
        
        this.logRequest(request.path, request.method,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            sourceId, targetId,
            ''
        );
        
        let apiCommandMessage: IApiCommandMessage = buildApiCommandMessageWithDefaultFlags(
            targetId, ApiTargetsAndSources.serviceSource,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            null
        );
        
        apiCommandMessage.generateMessageRawBytes();
        this._apiDal.sendApiCommandMessage(apiCommandMessage).then(apiResponseMessage => {
            let responsePayload: IGetMacAddressResponse = parseGetMacAddressResponse(apiResponseMessage.dataRawBytes);
            
            this.logResponse(request.path, request.method,
                SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
                commandId, commandName,
                sourceId, targetId,
                JSON.stringify(responsePayload)
            );
            
            response.status(200).json(responsePayload);
        }).catch(reason => {
            let errorCode: number = 400;
            let errorDetail: string = `Error in getMacAddress while sending API Command: ${reason}`;
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
        });
    }
    
    public getStatsId(request: Request, response: Response) {
        // DID: 0x11 | CID: 0x13 | TID(s): 1
        
        let commandId: number = 0x13;
        let commandName: string = this.getCommandName(commandId);
        
        if (!request.params.targetId) {
            let errorCode: number = 400;
            let errorDetail: string = 'targetId is required!';
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
            
            return;
        }
        
        // No inputs...
        
        let targetId: number = ByteConversionUtilities.nibblesToByte([1, parseInt(request.params.targetId)].reverse());
        let sourceId: number = ApiTargetsAndSources.serviceSource;
        
        this.logRequest(request.path, request.method,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            sourceId, targetId,
            ''
        );
        
        let apiCommandMessage: IApiCommandMessage = buildApiCommandMessageWithDefaultFlags(
            targetId, ApiTargetsAndSources.serviceSource,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            null
        );
        
        apiCommandMessage.generateMessageRawBytes();
        this._apiDal.sendApiCommandMessage(apiCommandMessage).then(apiResponseMessage => {
            let responsePayload: IGetStatsIdResponse = parseGetStatsIdResponse(apiResponseMessage.dataRawBytes);
            
            this.logResponse(request.path, request.method,
                SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
                commandId, commandName,
                sourceId, targetId,
                JSON.stringify(responsePayload)
            );
            
            response.status(200).json(responsePayload);
        }).catch(reason => {
            let errorCode: number = 400;
            let errorDetail: string = `Error in getStatsId while sending API Command: ${reason}`;
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
        });
    }
    
    public getProcessorName(request: Request, response: Response) {
        // DID: 0x11 | CID: 0x1F | TID(s): 1, 2
        
        let commandId: number = 0x1F;
        let commandName: string = this.getCommandName(commandId);
        
        if (!request.params.targetId) {
            let errorCode: number = 400;
            let errorDetail: string = 'targetId is required!';
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
            
            return;
        }
        
        // No inputs...
        
        let targetId: number = ByteConversionUtilities.nibblesToByte([1, parseInt(request.params.targetId)].reverse());
        let sourceId: number = ApiTargetsAndSources.serviceSource;
        
        this.logRequest(request.path, request.method,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            sourceId, targetId,
            ''
        );
        
        let apiCommandMessage: IApiCommandMessage = buildApiCommandMessageWithDefaultFlags(
            targetId, ApiTargetsAndSources.serviceSource,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            null
        );
        
        apiCommandMessage.generateMessageRawBytes();
        this._apiDal.sendApiCommandMessage(apiCommandMessage).then(apiResponseMessage => {
            let responsePayload: IGetProcessorNameResponse = parseGetProcessorNameResponse(apiResponseMessage.dataRawBytes);
            
            this.logResponse(request.path, request.method,
                SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
                commandId, commandName,
                sourceId, targetId,
                JSON.stringify(responsePayload)
            );
            
            response.status(200).json(responsePayload);
        }).catch(reason => {
            let errorCode: number = 400;
            let errorDetail: string = `Error in getProcessorName while sending API Command: ${reason}`;
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
        });
    }
    
    public getSku(request: Request, response: Response) {
        // DID: 0x11 | CID: 0x38 | TID(s): 1
        
        let commandId: number = 0x38;
        let commandName: string = this.getCommandName(commandId);
        
        if (!request.params.targetId) {
            let errorCode: number = 400;
            let errorDetail: string = 'targetId is required!';
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
            
            return;
        }
        
        // No inputs...
        
        let targetId: number = ByteConversionUtilities.nibblesToByte([1, parseInt(request.params.targetId)].reverse());
        let sourceId: number = ApiTargetsAndSources.serviceSource;
        
        this.logRequest(request.path, request.method,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            sourceId, targetId,
            ''
        );
        
        let apiCommandMessage: IApiCommandMessage = buildApiCommandMessageWithDefaultFlags(
            targetId, ApiTargetsAndSources.serviceSource,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            null
        );
        
        apiCommandMessage.generateMessageRawBytes();
        this._apiDal.sendApiCommandMessage(apiCommandMessage).then(apiResponseMessage => {
            let responsePayload: IGetSkuResponse = parseGetSkuResponse(apiResponseMessage.dataRawBytes);
            
            this.logResponse(request.path, request.method,
                SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
                commandId, commandName,
                sourceId, targetId,
                JSON.stringify(responsePayload)
            );
            
            response.status(200).json(responsePayload);
        }).catch(reason => {
            let errorCode: number = 400;
            let errorDetail: string = `Error in getSku while sending API Command: ${reason}`;
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
        });
    }
    
    public getCoreUpTimeInMilliseconds(request: Request, response: Response) {
        // DID: 0x11 | CID: 0x39 | TID(s): 1
        
        let commandId: number = 0x39;
        let commandName: string = this.getCommandName(commandId);
        
        if (!request.params.targetId) {
            let errorCode: number = 400;
            let errorDetail: string = 'targetId is required!';
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
            
            return;
        }
        
        // No inputs...
        
        let targetId: number = ByteConversionUtilities.nibblesToByte([1, parseInt(request.params.targetId)].reverse());
        let sourceId: number = ApiTargetsAndSources.serviceSource;
        
        this.logRequest(request.path, request.method,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            sourceId, targetId,
            ''
        );
        
        let apiCommandMessage: IApiCommandMessage = buildApiCommandMessageWithDefaultFlags(
            targetId, ApiTargetsAndSources.serviceSource,
            SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
            commandId, commandName,
            null
        );
        
        apiCommandMessage.generateMessageRawBytes();
        this._apiDal.sendApiCommandMessage(apiCommandMessage).then(apiResponseMessage => {
            let responsePayload: IGetCoreUpTimeInMillisecondsResponse = parseGetCoreUpTimeInMillisecondsResponse(apiResponseMessage.dataRawBytes);
            
            this.logResponse(request.path, request.method,
                SystemInfoDeviceRouter._deviceId, SystemInfoDeviceRouter._deviceName,
                commandId, commandName,
                sourceId, targetId,
                JSON.stringify(responsePayload)
            );
            
            response.status(200).json(responsePayload);
        }).catch(reason => {
            let errorCode: number = 400;
            let errorDetail: string = `Error in getCoreUpTimeInMilliseconds while sending API Command: ${reason}`;
            
            this.routeError(request.path, request.method, errorCode, errorDetail);
            
            response.status(errorCode).json({'error': errorDetail});
        });
    }
}
