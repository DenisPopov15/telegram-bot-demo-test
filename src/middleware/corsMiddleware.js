const cors = require('cors')

const CORS_ALLOW_ALL_ORIGINS = true
const CORS_ALLOWED_METHODS = '*'
const CORS_ALLOWED_HEADERS = 'content-type,authorization,accept'
const CORS_ALLOW_CREDENTIALS = true

const corsMiddleware = cors({
  optionsSuccessStatus: 200,
  origin: CORS_ALLOW_ALL_ORIGINS,
  methods: CORS_ALLOWED_METHODS,
  allowedHeaders: CORS_ALLOWED_HEADERS.split(','),
  credentials: true,
  ...(CORS_ALLOW_CREDENTIALS && { credentials: true })
})

module.exports = corsMiddleware