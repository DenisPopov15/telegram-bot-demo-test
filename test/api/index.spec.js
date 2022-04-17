'use strict'

const { expect } = require('chai')
const request    = require('supertest')
const createAuth = require('../../src/helpers/createAuth')

describe('DEMO', async() => {
  const auth = createAuth()

  it('demo', async() => {
    const response = await request(global.server)
      .post('/api/demo')
      .set('auth', auth)
      .send({ data: 'test' })

    expect(response.status).to.be.equal(200)
    expect(response.body.data).to.be.equal('test')
  })

})
