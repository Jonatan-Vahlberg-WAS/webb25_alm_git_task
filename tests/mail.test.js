const Mail = require('../src/models/Mail');

describe('Mail model hooks', () => {
  it('fills subject and content with user name', async () => {
    const mail = new Mail({
      status: 'welcome',
      user: {
        name: 'Josef',
        email: 'josef@test.com',
      },
    });

    await mail.validate();

    expect(mail.subject).toContain('Josef');
    expect(mail.content).toContain('Josef');
    expect(mail.content).toContain('josef@test.com');
  });

  it('fills subject and content without user name', async () => {
    const mail = new Mail({
      status: 'welcome',
      user: {
        email: 'noname@test.com',
      },
    });

    await mail.validate();

    expect(mail.subject).toContain('Välkommen');
    expect(mail.content).toContain('noname@test.com');
  });
});