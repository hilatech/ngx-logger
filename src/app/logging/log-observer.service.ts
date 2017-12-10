import { Injectable, Inject, InjectionToken } from '@angular/core';
import { ILogObserver, ILogEvent, ILogListener, LogLevel } from './log-types';
import { namespaceIsValid } from './log-helpers';
import { Observable } from 'rxjs/Observable';

const FUZZY_CHARACTER = '*';
const INDEX_NOT_FOUND = -1;

export let ALL: string = FUZZY_CHARACTER;
export let LOG_LISTENER: InjectionToken<ILogListener> = new InjectionToken('LogListener');

@Injectable()
export class LogObserver implements ILogObserver {
  private registry: { [namespace: string]: Array<ILogListener> };
  private listeners: Array<ILogListener> = [];

  constructor( @Inject(LOG_LISTENER) private args: ILogListener[] = []) {

    this.registry = {}
    this.registry[ALL] = [];

    // register listeners
    for (const arg of args) {
      this.register(arg);
    }
  }

  // returns a listener from the registry
  public getListener(listener: Function) {
    const match = this.listeners.filter((l) => {
      if (l instanceof listener) {
        return l;
      }
    })[0];
    return match;
  }

  public register(listener: ILogListener) {

    if (!namespaceIsValid(listener.namespace)) {
      throw new Error('Listener cannot register to (null) Namespace');
    }

    if (!this.namespaceInRegistry(listener.namespace)) {
      this.registry[listener.namespace] = [];
    }
    this.registry[listener.namespace].push(listener);
    this.listeners.push(listener);
  }

  public unregister(listener: ILogListener) {
    if (this.namespaceInRegistry(listener.namespace)) {
      const listeners = this.registry[listener.namespace];
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);

      // remove completely if no listeners
      if (listeners.length === 0) {
        delete (this.registry[listener.namespace]);
      }
    }
  };

  public log(namespace: string, level: LogLevel, action: ILogEvent) {
    if (!namespaceIsValid(namespace)) {
      throw new Error('Invalid Log Entry! namespace cannot be (null)');
    }
    const listeners = this.listenersToNotify(namespace, level);
    if (listeners.length) {
      const logMessage = action();
      listeners.forEach((listener) => {
        listener.log(namespace, level, logMessage);
      });
    }
  }

  private exactListenersToNotify(namespace: string, level: LogLevel): Array<ILogListener> {
    let listeners: Array<ILogListener> = [];

    if (this.namespaceInRegistry(namespace)) {
      listeners = this.extractQualifiedListenersForLogLevel(this.registry[namespace], level);
    }

    return listeners;
  }

  private extractQualifiedListenersForLogLevel(listeners: Array<ILogListener>, level: LogLevel): Array<ILogListener> {
    const qualifiedListeners: Array<ILogListener> = [];
    listeners.forEach((listener) => {
      if (level >= listener.level) {
        qualifiedListeners.push(listener);
      }
    });

    return qualifiedListeners;
  }

  private fuzzyListenersToNotify(namespace: string, level: LogLevel): Array<ILogListener> {
    let listeners: Array<ILogListener> = [];
    Object.keys(this.registry).forEach((key) => {
      if (key.indexOf(FUZZY_CHARACTER) !== INDEX_NOT_FOUND) {
        if (key === FUZZY_CHARACTER) {
          listeners = listeners.concat(this.extractQualifiedListenersForLogLevel(this.registry[key], level));
          return;
        }
        const startsWith = key.split(FUZZY_CHARACTER)[0];
        if (namespace.indexOf(startsWith) !== INDEX_NOT_FOUND) {
          listeners = listeners.concat(this.extractQualifiedListenersForLogLevel(this.registry[key], level));
        }
      }
    });
    return listeners;
  };

  protected listenersToNotify(namespace: string, level: LogLevel): Array<ILogListener> {
    let listeners: Array<ILogListener> = [];

    // exact match listeners that qualify
    if (this.namespaceInRegistry(namespace)) {
      listeners = this.exactListenersToNotify(namespace, level);
    }

    // fuzzy match listeners that qualify
    listeners = listeners.concat(this.fuzzyListenersToNotify(namespace, level));

    // remove duplicate listeners
    return listeners.filter((x, i, a) => x && a.indexOf(x) === i);
  }

  public namespaceInRegistry(namespace: string): boolean {
    return (namespace in this.registry);
  }

  public countListenersForNamespace(namespace: string): number {
    if (!this.namespaceInRegistry(namespace)) {
      return 0;
    }
    return this.registry[namespace].length;
  }
}
