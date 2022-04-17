'use strict'

const jwt = require('jsonwebtoken')

let { PUBLIC_KEY } = process.env
PUBLIC_KEY = PUBLIC_KEY.replace(/\\n/g, '\n')

const trustedTokenIssuers = [
  'telegram-bot-demo-test'
]
const serviceName = 'demo_service'

module.exports = (app) => {
  const handler = async (req, res, next) => {
    try {
      const token = req.headers['auth']
      if (!token) {
        const error = new Error('Auth missed')
        error.httpStatusCode = 401
        next(error)
      }

      const decoded = jwt.verify(token, PUBLIC_KEY)
      const { iss, aud } = decoded

      if (!trustedTokenIssuers.includes(iss) || aud !== serviceName) {
        const invalidTokenError = new Error('Auth not valid')
        invalidTokenError.httpStatusCode = 401
        next(invalidTokenError)
      }
    } catch (error) {
      error.httpStatusCode = 401
      next(error)
    }

    next()
  }

  return handler
}
