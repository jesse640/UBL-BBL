const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 3000

app.use(express.json())
const bcrypt = require('bcrypt')
const User = require('./models/userModel')
const {isValidEmail, isValidPassword } = require('./userFunctions/signup.js')

app.get('/', (req, res) => {
  res.send('Hello node api boss')
})

app.post('/user/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body
    
    // check if email is valid
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "invalid email" })
    }

    // check if username/email already exist
    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ error: "email already in use" })
    }

    // check password is secure
    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: "password must contain minimum 8 characters, at least one uppercase, one number, and one special character"
      })
    }

    // encryption
    const hashedPassword = await bcrypt.hash(password, 10)

    // create user with hashed password and store in database
    await User.create({ username, email, password: hashedPassword })
    res.status(201).json({ message: "Sign up successful" })
  } catch (error) {
    console.log(error.message)
    res.status(500).json(error.message)
  }
})

app.post('/user/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // check if user exists in database
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "email not found" })
    }

    // check encrypted password is correct
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: "incorrect password" })
    }

    res.status(200).json({ message: "successful login" })
  } catch (error) {
    res.status(500).json(error.message)
  }
})

mongoose.connect('mongodb+srv://admin:12345abcde@invoicedatabase.owzuo.mongodb.net/?retryWrites=true&w=majority&appName=InvoiceDataBase')
  .then(() => {
    console.log('Connected to DB')
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  }).catch((error) => {
    console.log(error)
  })
