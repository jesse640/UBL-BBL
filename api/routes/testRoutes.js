const express = require('express')
const router = express.Router()
const testController = require('../controllers/testController')

// Define routes
router.get('/:number', testController.add)

module.exports = router
