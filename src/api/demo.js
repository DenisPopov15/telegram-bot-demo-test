'use strict'

const demo = async (req, res) => {
  try {
    let { data } = req.body
    console.log('DATA!!', data)

    res.status(200).json({ data })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
}

module.exports = demo
