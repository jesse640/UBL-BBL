const testService = require('../services/testService')

exports.add = (req, res) => {
  const number = parseInt(req.params.number)
  const response = testService.add(number, number)
  res.status(201).json({ answer: response })
}
