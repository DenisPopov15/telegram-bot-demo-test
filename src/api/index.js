'use strict'

const express = require('express')
const router  = express.Router()
const demo = require('./demo')

router.route('/demo').post(demo)

module.exports = router
