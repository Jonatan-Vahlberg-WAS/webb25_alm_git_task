const User = require('../src/models/User')
const Mail = require('../src/models/Mail')
const { connectDb, disconnectDb } = require('./helpers/db')

describe('Mail pre-save hook', () => {
  beforeAll(async () => {
    await connectDb()
  })

  afterAll(async () => {
    await disconnectDb()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  it('adds subject and content with name', async () => {
    const user = await User.create({ name: 'Anna', email: 'anna@test.com', password: 'password' })
    const mail = await Mail.findOne({ user: user._id })

    expect(mail.subject).toBe('Välkommen Anna! Ditt konto är skapat')
    expect(mail.content).toContain('anna@test.com')
  })

  it('adds subject and content without name', async () => {
    const user = await User.create({ email: 'noname@test.com', password: 'password' })
    const mail = await Mail.findOne({ user: user._id })

    expect(mail.subject).toBe('Välkommen! Ditt konto är skapat')
    expect(mail.content).toContain('noname@test.com')
  })

  it('email is always in content', async () => {
    const user = await User.create({ email: 'always@test.com', password: 'password' })
    const mail = await Mail.findOne({ user: user._id })

    expect(mail.content).toContain('always@test.com')
  })
})
