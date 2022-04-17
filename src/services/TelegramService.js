const TelegramBot = require('node-telegram-bot-api')
const { TELEGRAM_BOT_TOKEN } = process.env

const web_app = { url: 'https://google.com' }

class TelegramService {
  constructor (config, logger) {
    this._config = config
    this._logger = logger
    // https://api.telegram.org/bot<token>/test/METHOD_NAME
    // const token = `${TELEGRAM_BOT_TOKEN}/test`
    const token = TELEGRAM_BOT_TOKEN
    this._bot = new TelegramBot(token, { polling: true })
  }

  // TODO: Check why its not works as expected
  async _setChatMenuButton (chatId) {
    const menu = {
      type: 'web_app',
      text: 'Order',
      web_app
    }

    const form = {
      chat_id: chatId,
      menu_button: menu
    }
    await this._bot._request('setChatMenuButton', { form })
  }

  listenOnMessage () {
    this._bot.on('message', async (msg) => {
      const chatId = msg.chat.id
      const { text, message_id, from, contact } = msg
      this._logger.info('MESSAGE', msg)

      if (text && text.startsWith('sss')) {
        await this._setChatMenuButton(chatId)
      }

      if (text && text.startsWith('ddd')) {
        const keyboard = [
          [{
            text: 'Custom Button!',
            // request_contact: true,
            // request_location: true,
            // request_poll: { type: 'Custom Pool' },
            web_app
          }]
        ]

        const inlineKeyboard = [
          [{
            text: 'Cool!',
            web_app,
            // callback_data: 'SomeCallbackData',
            // url:  `tg://user?id=${from.id}`,
            // url:  'https://google.com',
            // pay: true,
          }]
        ]

        const reply_markup = {
          // input_field_placeholder: 'Yeah',
          resize_keyboard: true,
          one_time_keyboard: true,
          // keyboard,
          inline_keyboard: inlineKeyboard
        }

        // const message = '<b>bold</b>, <strong>bold</strong><i>italic</i>, <em>italic</em><u>underline</u>, <ins>underline</ins><s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del><span class="tg-spoiler">spoiler</span>, <tg-spoiler>spoiler</tg-spoiler><b>bold <i>italic bold <s>italic bold strikethrough <span class="tg-spoiler">italic bold strikethrough spoiler</span></s> <u>underline italic bold</u></i> bold</b><a href="http://www.example.com/">inline URL</a><a href="tg://user?id=123456789">inline mention of a user</a><code>inline fixed-width code</code><pre>pre-formatted fixed-width code block</pre><pre><code class="language-python">pre-formatted fixed-width code block written in the Python programming language</code></pre>'
        const message = 'Hey'
        const options = {
          // reply_to_message_id: message_id,
          // parse_mode: 'HTML',
          reply_markup
        }
        this._bot.sendMessage(chatId, message, options)
          .catch((err) => this._logger.error(err, 'Unexpected error'))
       }
    })
  }

}

module.exports = TelegramService