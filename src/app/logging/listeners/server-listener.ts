import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { ILogListener, ILogMessage, LogLevel } from '../log-types';
import { ALL } from '../log-observer.service';

export type IServerListenerPrefix = () => string;

export class ServerListenerConfig {
    prefixLogsWithNamespace = true;
    namespaceWhiteList: Array<string> = [ALL];
    enabled = true;
    logLevel: LogLevel;
    prefix: IServerListenerPrefix;
    enablePrefix = false;
}

const defaultConfig = {
    prefixLogsWithNamespace: true,
    namespaceWhiteList: [ALL],
    enabled: true,
    prefix: () => {
        return 'Server'
    },
    enablePrefix: true,
    logLevel: LogLevel.Trace
}

export class ServerListener implements ILogListener {
    namespace = ALL;
    level = LogLevel.Error;

    constructor(private config: ServerListenerConfig, private http: HttpClient ) {
        // merge default config with config
        this.setConfig(config);
    }

    setConfig(config: ServerListenerConfig) {
        this.config = Object.assign(defaultConfig, config);
        this.level = this.config.logLevel;
    }

    // returns copy of config
    getConfig(): ServerListenerConfig {
        return Object.assign({}, this.config);
    }

    log(namespace: string, level: LogLevel, logMessage: ILogMessage) {
        if (!this.config.enabled) {
            return false;
        }

        if (!this.inWhitelist(namespace)) {
            return false;
        }

        if (level < this.config.logLevel) {
            return false;
        }

        let prefix = this.prefix(namespace);
        if (this.config.prefixLogsWithNamespace) {
            prefix += namespace + ': ';
        }

        const log = prefix + logMessage.message;
        this.postLog(level, log);
      }

    private postLog(level: LogLevel, message: string) {
      const url = '/api/common/log';
      const model = {
        level : level,
        message : message
      };

      this.http.post(url, model).subscribe(
        data => {
        },
        err => {
        }
      );
    }

    private prefix(namespace: string): string {
        if (!this.config.enablePrefix) {
            return '';
        }
        const prefix = this.config.prefix();
        return prefix;
    }

    private inWhitelist(namespace: string): boolean {
        if (this.config.namespaceWhiteList.indexOf(ALL) !== -1) {
            return true;
        }
        if (this.config.namespaceWhiteList.indexOf(namespace) !== -1) {
            return true;
        }

        return false;
    }
}
