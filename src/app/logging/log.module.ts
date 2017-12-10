import { NgModule, ModuleWithProviders } from '@angular/core';
import { LogObserver, LOG_LISTENER } from './log-observer.service';
import { ConsoleListenerConfig, ConsoleListener } from './listeners/console-listener';
import { ServerListenerConfig, ServerListener } from './listeners/server-listener';
import { HttpClient } from '@angular/common/http';
import { LogService } from './log.service';
import { HttpClientModule } from '@angular/common/http';
import { LogServiceFactory } from './log-service-factory';

@NgModule({
  imports: [
    HttpClientModule
  ],
  exports: [
  ],
  providers: [
    LogObserver,
    ConsoleListenerConfig,
    ServerListenerConfig,
    { provide: LOG_LISTENER, useClass: ConsoleListener, multi: true, deps: [ConsoleListenerConfig] },
    // { provide: LOG_LISTENER, useClass: ServerListener, multi: true, deps: [ServerListenerConfig, HttpClient] },
    LogService
  ]
})
export class LogModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LogModule,
      providers: [
        LogService,
        LogServiceFactory
      ]
    };
  }
}



