const request = require('supertest')
const { app, server } = require('../../main/server')
const User = require('../../main/models/UsersModel')
const mongoose = require('mongoose') // Import mongoose for DB teardown
server.close()

describe('POST /user/login', () => {
  beforeAll(async () => {
    await User.deleteMany({ email: 'testuser@example.com' }) // Ensure clean DB
  })

  afterAll(async () => {
    await mongoose.connection.close() // Ensure DB connection is closed
    server.close()
  })

  it('should create a new user and login successfully', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Password123*'
    }

    const response = await request(app)
      .post('/user/signup')
      .send(newUser)
      .expect(201)

    expect(response.body.message).toBe('Signup successful')

    const newLogin = {
      email: 'testuser@example.com',
      password: 'Password123*'
    }

    const response2 = await request(app)
      .post('/user/login')
      .send(newLogin)
      .expect(200)

    expect(response2.body.message).toBe('Login successful')

    await User.findByIdAndDelete(response.body.user._id) // Remove test user
  })

  // it('should return an error when not all fields are filled out i.e. no username provided', async () => {
  //   const newUser = {
  //     email: 'testuser@example.com',
  //     password: 'Password123*'
  //   }

  //   const response = await request(app)
  //     .post('/user/signup')
  //     .send(newUser)
  //     .expect(400)

  //   expect(response.body.error).toBe('Missing fields')
  // })

  // it('should return error when email is in wrong format', async () => {
  //   const newUser = {
  //     username: 'testuser',
  //     email: 'thisIsNotAnEmail',
  //     password: 'Password123*'
  //   }

  //   const response = await request(app)
  //     .post('/user/signup')
  //     .send(newUser)
  //     .expect(400)

  //   expect(response.body.error).toBe('Invalid email')
  // })

  // it('should return error when password is invalid i.e. min 8 characters, 1 capital, number and special character', async () => {
  //   const newUser = {
  //     username: 'testuser',
  //     email: 'testuser@example.com',
  //     password: 'badpassword'
  //   }

  //   const response = await request(app)
  //     .post('/user/signup')
  //     .send(newUser)
  //     .expect(400)

  //   expect(response.body.error).toBe(
  //     'Password must be at least 8 characters long, include 1 uppercase,' +
  //     ' 1 number, and 1 special character.'
  //   )
  // })

  // it('should return error when user already exists', async () => {
  //   const newUser = {
  //     username: 'testuser',
  //     email: 'testuser@example.com',
  //     password: 'Password123*'
  //   }

  //   // signup new user
  //   const response = await request(app)
  //     .post('/user/signup')
  //     .send(newUser)
  //     .expect(201)

  //   expect(response.body.message).toBe('Signup successful')

  //   // signup user again with same email and username
  //   const response2 = await request(app)
  //     .post('/user/signup')
  //     .send(newUser)
  //     .expect(400)

  //   expect(response2.body.error).toBe('User already exists')

  //   await User.findByIdAndDelete(response.body.user._id) // Remove test user
  // })
})
