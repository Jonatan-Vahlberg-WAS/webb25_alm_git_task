const { defineConfig } = require('vitest/config')

module.exports = defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    globalTeardown: ['./tests/globalTeardown.js'],
    testTimeout: 60000,
    hookTimeout: 60000
  }
})
