const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const path = require('path')

const testRoutes = require('./routes/testRoutes')
const userRoutes = require('./routes/userRoutes')
const invoiceRoutes = require('./routes/invoiceRoutes')
const invoiceRoutesV2 = require('./routes/invoiceRoutesV2')

const PORT = 3000

const app = express()

// middleware
app.use(express.json())

app.use(cookieParser())

// Load the YAML file
const swaggerDoc = YAML.load(path.join(__dirname, './swagger.yaml'))

// Set up Swagger UI route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.get('/', (req, res) => {
  res.send(`welcome to ubl-bbl invoice creation/validation project!
    go to /docs to access swagger documentation`)
})

app.use('/testing', testRoutes)

app.use('/users', userRoutes)

app.use('/invoice', invoiceRoutes)

app.use('/invoiceV2', invoiceRoutesV2)

mongoose.connect('mongodb+srv://admin:12345abcde@invoicedatabase.owzuo.mongodb.net/?retryWrites=true&w=majority&appName=InvoiceDataBase')
  .then(() => {
    console.log('Connected to DB')
  }).catch((error) => {
    console.log(error)
  })

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app

// module.exports = server uncomment for testing
