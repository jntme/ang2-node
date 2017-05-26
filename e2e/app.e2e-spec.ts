import { WtfPage } from './app.po';

describe('wtf App', () => {
  let page: WtfPage;

  beforeEach(() => {
    page = new WtfPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
