import { FrontendNominalRollsPage } from './app.po';

describe('nominal-roll-editor App', () => {
  let page: FrontendNominalRollsPage;

  beforeEach(() => {
    page = new FrontendNominalRollsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
