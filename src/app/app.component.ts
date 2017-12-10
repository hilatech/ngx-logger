import { Component, OnInit } from '@angular/core';
import { LogServiceFactory } from './logging';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private factory: LogServiceFactory) {

  }
  ngOnInit(): void {
    this.LogService.info('this is app init.', { test: 'hello you!'})
    this.LogService.error('this is app init.')
    this.LogService.debug('this is app init.')
    this.LogService.warn('this is app init.')
    this.LogService.trace('this is app init.')
    this.LogService.fatal('this is app init.')
  }

  get LogService() {
    return this.factory.create(AppComponent.name);
  }
}

