const express = require('express')
const router = express.Router()
const invoiceController = require('../controllers/invoiceController')
// const tokenController = require('../controllers/tokenAuth')

// Define routes
router.post('/create', invoiceController.create)
router.put('/:invoiceId', invoiceController.edit)
router.delete('/:invoiceId', invoiceController.delete)
router.post('/:invoiceId', invoiceController.send)
router.get('/:invoiceId', invoiceController.retrieve)
router.get('/search/:input', invoiceController.search)

module.exports = router
