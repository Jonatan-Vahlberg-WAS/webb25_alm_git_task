const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

/** @type {Promise<MongoMemoryServer> | undefined} */
let mongoServerPromise

/**
 * Start mongodb-memory-server once per test run (first connectDb call).
 * @returns {Promise<string>}
 */
async function ensureMemoryServer() {
  if (process.env.MONGODB_TEST_URI) {
    return process.env.MONGODB_TEST_URI
  }
  if (!mongoServerPromise) {
    mongoServerPromise = MongoMemoryServer.create().then((server) => {
      const uri = server.getUri()
      process.env.MONGODB_TEST_URI = uri
      global.__MONGO_MEMORY_SERVER__ = server
      return uri
    })
  }
  return mongoServerPromise
}

/**
 * Connect mongoose to the in-memory database.
 */
async function connectDb() {
  const uri = await ensureMemoryServer()
  if (mongoose.connection.readyState === 1) {
    return
  }
  await mongoose.connect(uri)
}

/**
 * Disconnect mongoose between test files; memory server stops in globalTeardown.
 */
async function disconnectDb() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
}

/**
 * Stop the in-memory MongoDB instance after all tests.
 */
async function stopMemoryServer() {
  await disconnectDb()
  const server = global.__MONGO_MEMORY_SERVER__
  if (server) {
    await server.stop()
    global.__MONGO_MEMORY_SERVER__ = undefined
    process.env.MONGODB_TEST_URI = ''
    mongoServerPromise = undefined
  }
}

module.exports = {
  connectDb,
  disconnectDb,
  stopMemoryServer
}
