'use strict'

const jwt = require('jsonwebtoken')
const DEFAULT_EXP_IN_SECONDS = 60
let { PRIVATE_KEY } = process.env
const BOT_AUDIENCE = 'demo_service'

const createAuth = () => {
  const now = Math.floor(Date.now() / 1000)
  const expiresAt = now + DEFAULT_EXP_IN_SECONDS

  const payload = {
    iss: 'telegram-bot-demo-test',
    aud: BOT_AUDIENCE,
    exp: expiresAt,
  }

  PRIVATE_KEY = PRIVATE_KEY.replace(/\\n/g, '\n')
  const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' })

  return token
}

module.exports = createAuth
