const express = require('express')
const app = express()
const res = require('express/lib/response')
const mongoose = require('mongoose')
const PORT = 3000

app.use(express.json())
const bcrypt = require('bcrypt')
const User = require('./models/userModel')

app.get('/', (req, res) => {
  res.send('Hello node api boss')
})

app.post('/user/signup', async(req, res) => {
  try {

    // check if username/email already exist
    const exists = User.findOne(req.body.email)
    if (exists) {
      return res.status(400).json({ error: "email already in use" })
    }

    // encryption
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const hashedUser = { username: req.body.username, email: req.body.email, password: hashedPassword }
    
    // create user with hashed password and store in database
    const user = await User.create(hashedUser)
    res.status(200).json(user)

  } catch (error) {
    console.log(error.message)
    res.status(500).json(error.message)
  }
})

app.post('/user/login', async(req, res) => {
  const { email, password } = req.body

  try {
    // check if user exists in database
    const user = await User.findOne({email})
    if (!user) {
        return res.status(400).json({ error: "user doesn't exist"})
    }

    // check encrypted password is correct
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(400).json({ error: "incorrect password" })
    }
    res.status(200).json("successful login")
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
