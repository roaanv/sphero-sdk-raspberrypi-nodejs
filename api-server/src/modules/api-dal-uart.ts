// external imports
import SerialPort from 'serialport';   // https://github.com/node-serialport/node-serialport

// internal imports
import {IApiCommandMessage} from '../models/api-command-message';
import {IApiResponseMessage} from '../models/api-response-message';
import {ApiDalBase, ApiDalTypes, IApiDal} from './api-dal-interface';
import {createLogger, ILogger} from './logger';
import {ApiParserFactory, IApiParser} from './api-parser';
import {IApiMessage} from '../models/api-message';
import {DeferredPromise} from '../models/deferred-promise';
import {ByteConversionUtilities} from '../utilities/byte-conversion-utilities';
import {ApiFlags, ApiProtocolErrorCodes} from '../constants';
import {ApiMessageLite, IApiMessageLite} from '../models/api-message-lite';
import {ICommandParserHandler} from './command-parser-factory';


let logger: ILogger = createLogger('api-dal-uart');


class ApiDalUart extends ApiDalBase {
    private readonly _apiParser: IApiParser;
    private readonly _serialPort: SerialPort;
    private readonly _apiCommandPendingResponseMap: Map<string, DeferredPromise<IApiResponseMessage>>;

    public sendCommandToClientHandler: (message: IApiMessageLite) => void;

    public getCommandParserHandler: (sourceId: number, deviceId: number, commandId: number) => ICommandParserHandler | null;

    public get type(): ApiDalTypes {
        return ApiDalTypes.Uart;
    }

    constructor(path: string, baudRate: number) {
        super();

        logger.debug('Starting');

        this._apiParser = ApiParserFactory.getApiParser();

        this._apiParser.apiMessageParsedCallback = (apiMessage: IApiMessage): void => {

            logger.debug(`Data bytes: ${ByteConversionUtilities.convertNumbersToHexCsvString(apiMessage.dataRawBytes)}`);

            // Check if message is command from robot (e.g. an async)
            if(apiMessage.isCommand && !apiMessage.isResponse) {
                let parsedData: object | null;
                if (apiMessage.dataRawBytes.length > 0) {
                    let commandParserHandler: ICommandParserHandler | null = this.getCommandParserHandler(apiMessage.sourceId, apiMessage.deviceId, apiMessage.commandId);
                    if (!commandParserHandler) {
                        logger.warning('Unable to retrieve command parser for given command.');
                        return;
                    }

                    parsedData = commandParserHandler(apiMessage.dataRawBytes);
                } else{
                    parsedData = null;
                }

                let apiMessageLite: IApiMessageLite = new ApiMessageLite(
                    apiMessage.deviceId,
                    apiMessage.deviceName,
                    apiMessage.commandId,
                    apiMessage.commandName,
                    apiMessage.sourceId,
                    parsedData
                );

                this.sendCommandToClientHandler(apiMessageLite);

                return;
            }

            let mapKey: string = this.getApiMessageMapKey(apiMessage);
            if (!this._apiCommandPendingResponseMap.has(mapKey)) {
                logger.error(`API Message key not found: ${mapKey}`);
                // TODO: do what?
            }

            let responsePromise: DeferredPromise<IApiResponseMessage> | undefined = this._apiCommandPendingResponseMap.get(mapKey);
            if (responsePromise) {
                if (apiMessage.hasError) {
                    let errorDetail: string = `Response has error code ${apiMessage.errorCode} (${apiMessage.errorMessage}).`;

                    logger.error(errorDetail);

                    responsePromise.reject(errorDetail);
                } else {
                    logger.debug('Promise resolved.');

                    responsePromise.resolve(apiMessage);
                }

                this._apiCommandPendingResponseMap.delete(mapKey);

                return;
            }

            logger.debug(`Key size: ${this._apiCommandPendingResponseMap.size}`);
            logger.warning('NO promise found!');
        };

        this._apiParser.apiProtocolErrorCallback = (errorCode: number): void => {
            logger.error(`API Protocol Error: '${ApiProtocolErrorCodes.getApiProtocolErrorMessageFromCode(errorCode)}' (${errorCode})`);
        };

        this._serialPort = new SerialPort(path, {
            autoOpen: false,
            baudRate: baudRate
        });

        this._serialPort.on('open', (): void => {
            logger.debug('Serial Port opened');
        });
        this._serialPort.on('close', (): void => {
            logger.debug('Serial Port closed');
        });
        this._serialPort.on('data', (data: Array<number>): void => {
            logger.debug(`Received bytes: ${ByteConversionUtilities.convertNumbersToHexCsvString(data)}`);

            this._apiParser.queueBytes(data);
        });
        this._serialPort.on('drain', (): void => {
            logger.debug('Serial Port drained');
        });
        this._serialPort.on('error', (error: Error): void => {
            logger.error(`An error occurred on Serial Port: '${error}'`);
        });

        this._apiCommandPendingResponseMap = new Map<string, DeferredPromise<IApiResponseMessage>>();

        this._serialPort.open(error => {
            if (!error) {
                return;
            }

            logger.error(`An error occurred while opening Serial Port: '${error}'`);
        });

        // TODO: do we need these?
        // this._serialPort.close(error => {
        //
        // });
        // this._serialPort.drain(error => {
        //
        // });
    }

    protected async sendApiCommandMessageInternal(apiCommandMessage: IApiCommandMessage): Promise<IApiResponseMessage> {
        logger.debug(`Attempting to send API Command Message: ${apiCommandMessage.prettyPrint()}`);

        let responsePromise: DeferredPromise<IApiResponseMessage> = new DeferredPromise<IApiResponseMessage>();

        if (apiCommandMessage.isRequestingResponse) {
            let mapKey: string = this.getApiMessageMapKey(apiCommandMessage);

            this._apiCommandPendingResponseMap.set(mapKey, responsePromise);

            logger.debug(`Key size: ${this._apiCommandPendingResponseMap.size}`);
        } else {
            responsePromise.resolve();
        }

        this.writeBytesToPort(apiCommandMessage.messageRawBytes);
        return responsePromise.promise;
    }

    private writeBytesToPort(bytes: Array<number>): boolean {
        logger.debug(`Bytes being sent: ${ByteConversionUtilities.convertNumbersToHexCsvString(bytes)}`);

        let isWaitingForDrain: boolean = this._serialPort.write(bytes, 'utf8', ((error, bytesWritten) => {
            // TODO: do something with this - log?
        }));

        return isWaitingForDrain;
    }

    private getApiMessageMapKey(apiMessage: IApiMessage): string {
        let mapKey: string = `${apiMessage.sequenceNumber}.${apiMessage.deviceId}.${apiMessage.commandId}`;
        //${apiMessage.targetId}.${apiMessage.sourceId}.

        logger.debug(`Generated API Message key: '${mapKey}'`);

        return mapKey;
    }
}

let _uartApiDal: ApiDalUart | null = null;
export function buildUartApiDal(path: string, baudRate: number): IApiDal {
    if (_uartApiDal == null) {
        _uartApiDal = new ApiDalUart(path, baudRate);
    }

    return _uartApiDal;
}
