
import { TestBed, async, inject } from '@angular/core/testing';
import { ILogListener, ILogMessage, LogObserver, ALL, LogLevel } from './log-service';

class GlobalLogListener implements ILogListener {
  didGetNotified = false;
  namespace = ALL;
  level = LogLevel.Trace;
  onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
    this.didGetNotified = true;
  }
}

class DummyNamespaceListenerA implements ILogListener {
  didGetNotified = false;
  namespace = 'dummynamespace';
  level = LogLevel.Trace;
  onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
    this.didGetNotified = true;
  }
}

class DummyNamespaceListenerB implements ILogListener {
  didGetNotified = false;
  namespace = 'dummynamespace';
  level = LogLevel.Trace;
  onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
    this.didGetNotified = true;
  }
}

class DummyFuzzyNamespaceListener implements ILogListener {
  didGetNotified = false;
  namespace = 'dummyname*';
  level = LogLevel.Trace;
  onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
    this.didGetNotified = true;
  }
}

class DummyErrorOnlyListener implements ILogListener {
  didGetNotified = false;
  level = LogLevel.Error;
  namespace = 'dummyname';
  onLog(namespace: string, level: LogLevel, logMessage: ILogMessage) {
    this.didGetNotified = true;
  }
}

describe('Service: LogObserverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LogObserver,
          useFactory: () => {
            return new LogObserver();
          }
        }
      ]
    });
  });

  it('should ...', inject([LogObserver], (service: LogObserver) => {
    expect(service).toBeTruthy();
  }));

  it('throw exception for registering listener on (null) namespace ...', inject([LogObserver], (service: LogObserver) => {
    const listener = new DummyNamespaceListenerA();
    listener.namespace = null;
    expect(() => service.register(listener)).toThrow();
  }));

  it('throw exception for calling onDidLog where namespace is (null) ...', inject([LogObserver], (service: LogObserver) => {

    expect(() => service.log(null, LogLevel.Trace, () => {
      return {
        message: 'Test Log'
      }
    })).toThrow();
  }));

  it('should register ILogListener ...', inject([LogObserver], (service: LogObserver) => {
    const listener = new DummyNamespaceListenerA();
    service.register(listener);

    const actual = service.namespaceInRegistry(listener.namespace);
    expect(actual).toBeTruthy();

  }));

  it('should unregister ILogListener ...', inject([LogObserver], (service: LogObserver) => {
    const listener = new DummyNamespaceListenerA();
    service.register(listener);
    service.unregister(listener);

    const actual = service.namespaceInRegistry(listener.namespace);
    expect(actual).toBeFalsy();

  }));

  it('should register multiple listeners to same namespace ...', inject([LogObserver], (service: LogObserver) => {
    const listenerA = new DummyNamespaceListenerA();
    const listenerB = new DummyNamespaceListenerB();
    service.register(listenerA);
    service.register(listenerB);

    const expected = 2;
    const actual = service.countListenersForNamespace(listenerA.namespace);
    expect(actual).toEqual(expected);

  }));

  it('should register multiple listeners to same namespace and remove 1 ...',
   inject([LogObserver], (service: LogObserver) => {

    const listenerA = new DummyNamespaceListenerA();
    const listenerB = new DummyNamespaceListenerB();
    service.register(listenerA);
    service.register(listenerB);

    service.unregister(listenerA);

    const expectedListenerCountOfUnregister = 1;

    const actualNamespaceExists = service.namespaceInRegistry(listenerA.namespace);
    const actualListenerCount = service.countListenersForNamespace(listenerA.namespace);

    expect(actualNamespaceExists).toBeTruthy();
    expect(actualListenerCount).toEqual(expectedListenerCountOfUnregister);

  }));

  it('fuzzy listener should listen to "dummyname" with registered namespace dummyname*',
   inject([LogObserver], (service: LogObserver) => {
    const dummyFuzzyListener = new DummyFuzzyNamespaceListener();
    service.register(dummyFuzzyListener);
    service.log('dummyname', LogLevel.Trace, () => {
      return {
        message: 'Test Log'
      }
    });
    expect(dummyFuzzyListener.didGetNotified).toBeTruthy();
  }));

  it('global listener should listen to all log events...', inject([LogObserver], (service: LogObserver) => {
    const globalListener = new GlobalLogListener();
    service.register(globalListener);
    service.log('test', LogLevel.Trace, () => {
      return {
        message: 'Test Log'
      }
    });
    expect(globalListener.didGetNotified).toBeTruthy();
  }));

  it('ErrorOnly listener should not be notified of ns: "dummyname" and level is All',
   inject([LogObserver], (service: LogObserver) => {

    const listener = new DummyErrorOnlyListener();
    service.register(listener);
    service.log('dummyname', LogLevel.Trace, () => {
      return {
        message: 'Test Log'
      }
    });
    expect(listener.didGetNotified).toBeFalsy();
  }));

  it('ErrorOnly listener should be notified of ns: "dummyname" and level is Fatal',
   inject([LogObserver], (service: LogObserver) => {
    const listener = new DummyErrorOnlyListener();
    service.register(listener);
    service.log('dummyname', LogLevel.Critical, () => {
      return {
        message: 'Test Log'
      }
    });
    expect(listener.didGetNotified).toBeTruthy();
  }));

});
