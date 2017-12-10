import { NgModule, ModuleWithProviders } from '@angular/core';
import { LogObserver, LOG_LISTENER } from './log-observer.service';
import { ConsoleListenerConfig, ConsoleListener } from 'app/logging/listeners/console-listener';
import { ServerListenerConfig, ServerListener } from 'app/logging/listeners/server-listener';
import { HttpClient } from '@angular/common/http';
import { LogService } from 'app/logging/log.service';
import { HttpClientModule } from '@angular/common/http';
import { LogServiceFactory } from 'app/logging';

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


