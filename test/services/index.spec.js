'use strict'

const { expect } = require('chai')
const TelegramService = require('../../src/services/TelegramService')

const { TEST_TELEGRAM_WEB_APP_INIT_DATA } = process.env

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

  it('.validateInitData', async() => {
    const initData = TEST_TELEGRAM_WEB_APP_INIT_DATA
    const result = telegramService.validateInitData(initData)
    expect(result.isVerified).to.be.equal(true)
  })

})
