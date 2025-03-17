const request = require('supertest')
const { app, server } = require('../api/server')
const mongoose = require('mongoose')

describe('GET /testing/:number (simple addition test)', () => {
  afterAll(async () => {
    await mongoose.connection.close()
    server.close()
  })

  it('check add function works properly', async () => {
    const number = 1

    const response = await request(app)
      .get(`/testing/${number}`)
      .expect(201)

    expect(response.body.answer).toBe(2)
  })
})
