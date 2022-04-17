'use strict'

const { expect } = require('chai')
const TelegramService = require('../../src/services/TelegramService')

describe('TelegramService', async() => {
  let telegramService

  before(async() => {
    telegramService = new TelegramService({}, console)
  })

  it('.', async() => {
    expect(true).to.be.deep.equal(true)
    // expect().to.be.not.undefined
    // expect().to.be.deep.equal()
  })

})
