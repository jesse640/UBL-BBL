const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const path = require('path')

const testRoutes = require('./routes/testRoutes')
const userRoutes = require('./routes/userRoutes')
const invoiceRoutes = require('./routes/invoiceRoutes')
const invoiceRoutesV2 = require('./routes/invoiceRoutesV2')

// const PORT = 3000

const app = express()

// middleware
app.use(express.json())

app.use(cookieParser())

// swagger documentation
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UBL-BBL invoice creation/validation API',
      version: '1.0.0'
    }
  },
  apis: [path.join(__dirname, 'swagger.yaml')]
}

const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css'

// Swagger setup
const swaggerSpec = swaggerJsdoc(options)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
  customCssUrl: CSS_URL
}
))

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

// const server = app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`)
// })

module.exports = app

// module.exports = server uncomment for testing
