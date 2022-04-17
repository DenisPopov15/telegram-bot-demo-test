'use strict'

require('dotenv').config()

const App = require('../src/App')

before(async() => {
  const app = new App()
  await app.start()

  global.server = app.server
})

describe('API', () => {
  require('./api/index.spec')
})

describe('Services', () => {
  require('./services/index.spec')
})

