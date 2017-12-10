import { ALL } from './log-observer.service';

export enum LogLevel {
    Trace = 0,
    Debug = 1,
    Information = 2,
    Warning = 3,
    Error = 4,
    Critical = 5
}

export interface ILog {
  trace(message: string, obj: any): void;
  error(message: string, obj: any): void;
  warn(message: string, obj: any): void;
  info(message: string, obj: any): void;
  debug(message: string, obj: any): void;
};

export type ILogEvent = ()  => ILogMessage

export interface ILogMessage {
  message: string;
  obj?: any;
}

export interface ILogMessager {
  messageSent(message: string, payload?: any): void;
}

export abstract class ILogListener {
  namespace: string = ALL;
  level: LogLevel;
  abstract log(namespace: string, level: LogLevel, logMessage: ILogMessage): void;
}

export interface ILogObserver {
  log(namespace: string, level: LogLevel, action: ILogEvent): void;
  register(listener: ILogListener): void;
  getListener(listener: Function): void;
}
