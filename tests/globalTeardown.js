const { stopMemoryServer } = require('./helpers/db')

module.exports = async () => {
  await stopMemoryServer()
}
