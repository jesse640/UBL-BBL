const request = require('supertest')
const { app, server } = require('../../api/server')
const User = require('../../api/models/UsersModel')
const mongoose = require('mongoose')
server.close()

describe('POST /user/signout', () => {
  afterAll(async () => {
    await mongoose.connection.close()
    server.close()
  })

  it('should create a new user and login successfully', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Password123*'
    }

    const signInResoinse = await request(app)
      .post('/user/signup')
      .send(newUser)
      .expect(201)

    const loginResponse = await request(app)
      .post('/user/login')
      .send({ email: newUser.email, password: newUser.password })
      .expect(200)

    expect(loginResponse.body.message).toBe('Login successful')

    const response2 = await request(app)
      .post('/user/signout')
      .set('Cookie', 'random')

      .expect(401)

    expect(response2.body.message).toBe('No token provided')

    const response = await request(app)
      .post('/user/signout')
      .set('Cookie', loginResponse.headers['set-cookie'])
      .expect(200)

    expect(response.body.message).toBe('Logged out')
    expect(response.headers['set-cookie'][0]).toMatch(/token=none/)

    await User.findOneAndDelete({ username: newUser.username })
  })
})
