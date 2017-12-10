import {  ILogListener, ILogMessage, LogLevel } from '../log-types';
import { ALL } from '../log-observer.service';

export class ExtensionListener implements ILogListener {

    namespace = ALL; // what namespace you want to listen for
    level = LogLevel.Trace; // log level

    log(namespace: string, level: LogLevel, logMessage: ILogMessage) {
        const event = new CustomEvent('logMonitorEvent', {
            detail: {
                message: logMessage.message,
                namespace: namespace,
                level: level,
                data: logMessage.obj
            }
        });
        setTimeout(() => {
            window.dispatchEvent(event);
        }, 0);
    }

}
