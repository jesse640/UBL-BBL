const request = require('supertest')
const { app, server } = require('../../api/server')
const User = require('../../api/models/UsersModel')
const mongoose = require('mongoose')
server.close()

jest.setTimeout(30000)

describe('PUT /user/info', () => {
  let userId
  let userId2

  afterAll(async () => {
    await User.findByIdAndDelete(userId)
    await User.findByIdAndDelete(userId2)
    await mongoose.connection.close()
    server.close()
  })

  it('should create a new user and login successfully', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Password123*'
    }

    const signupResponse = await request(app)
      .post('/user/signup')
      .send(newUser)
      .expect(201)

    expect(signupResponse.body.message).toBe('Signup successful')
    userId = signupResponse.body.user._id

    const newUser2 = {
      username: 'testuser2',
      email: 'testuser2@example.com',
      password: 'Password123*'
    }

    const signupResponse2 = await request(app)
      .post('/user/signup')
      .send(newUser2)
      .expect(201)

    expect(signupResponse2.body.message).toBe('Signup successful')
    userId2 = signupResponse2.body.user._id

    const loginResponse = await request.agent(app)
      .post('/user/login')
      .send({ email: newUser.email, password: newUser.password })
      .expect(200)

    expect(loginResponse.body.message).toBe('Login successful')

    const response1 = await request(app)
      .put('/user/info')
      .set('Cookie', loginResponse.headers['set-cookie'])
      .send({ newemail: 'changedemail@example.com' })
      .expect(200)

    expect(response1.body.message).toBe('Successfully updated user info')

    const response2 = await request(app)
      .put('/user/info')
      .set('Cookie', response1.headers['set-cookie'])
      .send({ newemail: 'changedemail@example.com' })
      .expect(400)

    expect(response2.body.error).toBe('New email should not be current email')

    const response3 = await request(app)
      .put('/user/info')
      .set('Cookie', response1.headers['set-cookie'])
      .send({ newusername: 'newtestuser' })
      .expect(200)

    expect(response3.body.message).toBe('Successfully updated user info')

    const response4 = await request(app)
      .put('/user/info')
      .set('Cookie', response3.headers['set-cookie'])
      .send({ newusername: 'testuser2' })
      .expect(400)

    expect(response4.body.error).toBe('Username already exists')

    const response5 = await request(app)
      .put('/user/info')
      .set('Cookie', response3.headers['set-cookie'])
      .send({ newusername: 'newtestuser' })
      .expect(400)

    expect(response5.body.error).toBe('New username should not be current username')

    const response6 = await request(app)
      .put('/user/info')
      .set('Cookie', response3.headers['set-cookie'])
      .send({ newpassword: 'NewPassword123*' })
      .expect(200)

    expect(response6.body.message).toBe('Successfully updated user info')

    const response7 = await request(app)
      .put('/user/info')
      .set('Cookie', response6.headers['set-cookie'])
      .send({ newpassword: 'NewPassword123*' })
      .expect(400)

    expect(response7.body.error).toBe('New password should not be current password')

    const response8 = await request(app)
      .put('/user/info')
      .set('Cookie', response6.headers['set-cookie'])
      .send({ newpassword: 'short' })
      .expect(400)

    expect(response8.body.error).toMatch('Password must be at least 8 characters long, include 1 uppercase, ' +
    '1 number, and 1 special character.')

    const response9 = await request(app)
      .put('/user/info')
      .set('Cookie', response6.headers['set-cookie'])
      .send({ newemail: 'multiupdate@example.com', newusername: 'multiuser' })
      .expect(200)

    expect(response9.body.message).toBe('Successfully updated user info')

    const response10 = await request(app)
      .put('/user/info')
      .set('Cookie', response9.headers['set-cookie'])
      .send({ newemail: 'emailpass@example.com', newpassword: 'NewSecurePass123*' })
      .expect(200)

    expect(response10.body.message).toBe('Successfully updated user info')

    const response11 = await request(app)
      .put('/user/info')
      .set('Cookie', response10.headers['set-cookie'])
      .send({ newusername: 'userpass', newpassword: 'AnotherPass123*' })
      .expect(200)

    expect(response11.body.message).toBe('Successfully updated user info')

    const response12 = await request(app)
      .put('/user/info')
      .set('Cookie', response11.headers['set-cookie'])
      .send({ newemail: 'emailpass@example.com', newusername: 'userpass' })
      .expect(400)

    expect(response12.body.error).toBe('New username should not be current username')

    const response13 = await request(app)
      .put('/user/info')
      .send({ newusername: 'anotheruser' })
      .expect(401)

    expect(response13.body.message).toBe('No token provided')

    await User.findByIdAndDelete(userId)
    await User.findByIdAndDelete(userId2)
  })
})
