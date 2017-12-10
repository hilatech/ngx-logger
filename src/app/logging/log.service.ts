import { Injectable, EventEmitter, Inject } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AsyncSubject } from 'rxjs/AsyncSubject';

import { ILog, ILogEvent, LogLevel } from './log-types';
import { LogObserver, ALL } from './log-observer.service';

@Injectable()
export class LogService implements ILog {
  private _ns: string;

  constructor(private logObserver: LogObserver) { }

  set namespace(ns: string) {
    this._ns = ns;
  }

  get namespace(): string {
    return this._ns;
  }

  public logDeferred(level: LogLevel, action: ILogEvent) {
    this.logObserver.log(this._ns, level, action);
  };

  public debug(message: string, obj: any = null) {
    this.log(message, LogLevel.Debug, obj);
  }

  public info(message: string, obj: any = null) {
    this.log(message, LogLevel.Information, obj);
  }

  public warn(message: string, obj: any = null) {
    this.log(message, LogLevel.Warning, obj);
  }

  public error(message: string, obj: any = null) {
    this.log(message, LogLevel.Error, obj);
  }

  public fatal(message: string, obj: any = null) {
    this.log(message, LogLevel.Critical, obj);
  }

  public trace(message: string, obj: any = null) {
    this.log(message, LogLevel.Trace, obj);
  }

  private log(message: string, level: LogLevel, obj: any = null) {
    this.logObserver.log(this._ns, level, () => {
      return {
        message: message,
        obj: obj
      }
    });
  }
}
