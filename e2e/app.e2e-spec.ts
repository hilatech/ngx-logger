import { NgxLogPage } from './app.po';

describe('ngx-log App', () => {
  let page: NgxLogPage;

  beforeEach(() => {
    page = new NgxLogPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
