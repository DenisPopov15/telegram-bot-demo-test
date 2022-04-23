const crypto = require('crypto')

class CryptoService {
  constructor (logger) {
    this._logger = logger
  }

  createHmacSha256(message, secret, format) {
    const hash = crypto.createHmac('sha256', secret).update(message).digest(format)

    return hash
  }

}

module.exports = CryptoService