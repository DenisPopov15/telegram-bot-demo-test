const TelegramBot = require('node-telegram-bot-api')
const { TELEGRAM_BOT_TOKEN } = process.env

class TelegramService {
  constructor (config, logger) {
    this._config = config
    this._logger = logger
    this._bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true })
  }

  listenOnMessage () {
    this._bot.on('message', async (msg) => {
      const chatId = msg.chat.id
      const { text } = msg
      this._logger.info({ msg }, 'MESSAGE')

      const message = 'All Good'
      this._bot.sendMessage(chatId, message)
        .catch((err) => this.logger.error(err, 'Unexpected error'))
    })
  }

}

module.exports = TelegramService