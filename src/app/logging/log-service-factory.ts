import { Injectable } from '@angular/core';

import { LogObserver, ALL } from './log-observer.service';
import { LogService } from './log.service';

@Injectable()
export class LogServiceFactory {

    constructor(private logObserver: LogObserver) {
    }

    public create(namespace: string = ALL): LogService {
        const logService = new LogService(this.logObserver);
        logService.namespace = namespace;

        return logService;
    }
}
