const TelegramBot   = require('node-telegram-bot-api')
const CryptoService = require('./CryptoService')
const { TELEGRAM_BOT_TOKEN, PORTMONE_TOKEN } = process.env

const web_app = { url: 'https://google.com' }
// https://t.me/durgerkingbot?startattach

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
      text: 'Order!',
      web_app
    }

    const form = {
      chat_id: chatId,
      menu_button: menu
    }
    await this._bot._request('setChatMenuButton', { form })
  }

  validateInitData(initData) {
    const EXPIRATION_IN_SECONDS = 2 * 60 * 60
    const result = { isVerified: false, error: '', data: {} }
    const initDataObject = Object.fromEntries(new URLSearchParams(initData))

    const checkString = Object.keys(initDataObject)
        .filter((key) => key !== 'hash')
        .map((key) => `${key}=${initDataObject[key]}`)
        .sort()
        .join('\n')

    const cryptoService = new CryptoService(this._logger)
    const secretKey   = cryptoService.createHmacSha256(TELEGRAM_BOT_TOKEN, 'WebAppData')
    const derivedHash = cryptoService.createHmacSha256(checkString, secretKey, 'hex')

    if (initDataObject.hash !== derivedHash) {
      result.error = 'Auth not valid'
      return result
    }

    // const expiresAt = (initDataObject.auth_date + EXPIRATION_IN_SECONDS) * 1000
    // if (expiresAt > Date.now()) {
    //   result.error = 'Auth expired'
    //   return result
    // }

    result.isVerified = true
    result.data = initDataObject
    return result
  }

  async sendInvoice(chatId) {
    const CENTS_IN_UAH = 100
    const form = {
      need_phone_number: true,
      need_shipping_address: true,
      max_tip_amount: 100 * CENTS_IN_UAH,
      suggested_tip_amounts: [10 * CENTS_IN_UAH, 20 * CENTS_IN_UAH, 50 * CENTS_IN_UAH, 100 * CENTS_IN_UAH],
      // need_name: true,
      // need_email: true,
      photo_url: 'https://png.pngtree.com/element_our/20190530/ourmid/pngtree-box-full-of-goods-image_1252285.jpg',
      // photo_width: 100,
      // photo_height: 100,
    }
    const title = 'Best Product'
    const description = 'The best what can happens with you'
    const payload = JSON.stringify({ someData: 'data' })
    const currency = 'UAH'
    const providerToken = PORTMONE_TOKEN
    const prices = [
      { label: 'Boxes', amount: 150 * CENTS_IN_UAH },
      { label: 'Delivery', amount: 50 * CENTS_IN_UAH },
    ]

    // Will be used if will be clicked from forwarded message
    // const startParameter = 'https://t.me/DenysDevTestBot?start=ded'
    const startParameter = null

    const result = await this._bot.sendInvoice(
      chatId,
      title,
      description,
      payload,
      providerToken,
      startParameter,
      currency,
      prices,
      form
    )

    return result
  }

  async proceedInvoice(preCheckout) {
    const ok = true
    const result = await this._bot.answerPreCheckoutQuery(preCheckout.id, ok)
    if (result === true) {
      this._logger.info('Payment sent')
    } else {
      this._logger.info('Payment not proceeded', result)
    }
  }

  async proceedSuccessfulPaymnet(msg) {
    const { message_id, from, date, successful_payment } = msg
    this._logger.info('Payment successfully executed')
  }

  listenOnPreCheckOut() {
    this._bot.on('pre_checkout_query', async (msg) => {
      // this._logger.info('pre_checkout_query', msg)
      await this.proceedInvoice(msg)

    })
  }

  listenOnMessage () {
    this._bot.on('message', async (msg) => {
      const chatId = msg.chat.id
      const { text, message_id, from, contact, successful_payment } = msg
      this._logger.info('MESSAGE', msg)

      if (successful_payment) {
        await this.proceedSuccessfulPaymnet(msg)
      }

      if (text && text.startsWith('sss')) {
        await this._setChatMenuButton(chatId)
      }

      if (text && text.startsWith('iii')) {
        await this.sendInvoice(chatId)
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