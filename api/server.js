const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const path = require('path');

const testRoutes = require('./routes/testRoutes')
const userRoutes = require('./routes/userRoutes')
const invoiceRoutes = require('./routes/invoiceRoutes')

const PORT = 3000

const app = express()

// middleware
app.use(express.json())

app.use(cookieParser())

// Dynamically load swagger document
const swaggerDocument = YAML.load(
  path.join(
    process.env.NODE_ENV === 'production' 
      ? '/vercel/path0' 
      : path.join(__dirname, '..'), 
    'swagger.yaml'
  )
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/', (req, res) => {
  res.send('welcome to ubl-bbl invoice creation/validation project!')
})

app.use('/testing', testRoutes)

app.use('/users', userRoutes)

app.use('/invoice', invoiceRoutes)

mongoose.connect('mongodb+srv://admin:12345abcde@invoicedatabase.owzuo.mongodb.net/?retryWrites=true&w=majority&appName=InvoiceDataBase')
  .then(() => {
    console.log('Connected to DB')
  }).catch((error) => {
    console.log(error)
  })

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app

// module.exports = server uncomment for testing
