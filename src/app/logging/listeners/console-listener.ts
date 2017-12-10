import { Injectable } from '@angular/core';

import { ILogListener, ILogMessage, LogLevel } from '../log-types';
import { ALL } from '../log-observer.service';

export type IConsoleListenerPrefix = () => string;

export class ConsoleListenerConfig {
  prefixLogsWithNamespace = true;
  namespaceWhiteList: Array<string> = [ALL];
  enabled = true;
  logLevel: LogLevel;
  prefix: IConsoleListenerPrefix;
  enablePrefix = false;
  colors = [
    { level: LogLevel.Trace, color: 'steelblue', levelColor: 'white' },
    { level: LogLevel.Critical, color: 'crimson', levelColor: 'white' },
    { level: LogLevel.Error, color: 'red', levelColor: 'white' },
    { level: LogLevel.Warning, color: 'darkorange', levelColor: 'white' },
    { level: LogLevel.Information, color: 'green', levelColor: 'white' },
    { level: LogLevel.Debug, color: 'gray', levelColor: 'white' },
  ]
}

const defaultConfig = {
  prefixLogsWithNamespace: true,
  namespaceWhiteList: [ALL],
  enabled: true,
  prefix: () => {
    return ''
  },
  enablePrefix: true,
  logLevel: LogLevel.Trace
}

export class ConsoleListener implements ILogListener {
  namespace = ALL;
  level = LogLevel.Trace;

  constructor(private config: ConsoleListenerConfig) {
    // merge default config with config
    this.setConfig(config);
  }

  setConfig(config: ConsoleListenerConfig) {
    this.config = Object.assign(defaultConfig, config);
    this.level = this.config.logLevel;
  }

  // returns copy of config
  getConfig(): ConsoleListenerConfig {
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
    const beautifyObject = this.beautifyObjectForConsole(logMessage.obj);
    const coloring = this.coloringForConsole(level);
    const logLevel = LogLevel[level];

    if (beautifyObject) {
      console.log(`%c[${logLevel}]` + `%c ${log}`, coloring.level, coloring.text, beautifyObject);
    } else {
      console.log(`%c[${logLevel}]` + `%c ${log}`, coloring.level, coloring.text)
    }
  }

  private coloringForConsole(level: LogLevel): any {
    const colors = this.config.colors.find(c => c.level === level);
    if (!colors) {
      return {
        level: '',
        text: ''
      }
    }

    return {
      level: `background: ${colors.color};color: ${colors.levelColor};`,
      text: `color: ${colors.color};`
    }
  }

  private beautifyObjectForConsole(obj: any) {
    if (!obj) {
      return null;
    }
    return JSON.stringify(obj, null, 2)
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
