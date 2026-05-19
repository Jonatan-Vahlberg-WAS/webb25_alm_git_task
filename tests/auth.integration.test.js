const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/User')
const Mail = require('../src/models/Mail')
const { connectDb, disconnectDb } = require('./helpers/db')

describe('POST /api/auth/register', () => {
  beforeAll(async () => {
    await connectDb()
  })

  afterAll(async () => {
    await disconnectDb()
  })

  beforeEach(async () => {
    await User.deleteMany({ email: 'new@test.com' })
  })

  it('create a welcome email on register', async () => {
    const res = await request(app).post('/auth/register').send({ email: 'new@test.com', password: 'password' })
    expect(res.status).toBe(201)
    const mail = await Mail.findOne({ status: 'welcome' })
    expect(mail).toBeTruthy()
  })
})
