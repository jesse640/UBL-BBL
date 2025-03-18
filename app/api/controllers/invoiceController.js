const invoiceService = require('../services/invoiceService.js')

// let trie;

// function createTrie() {
//   let trie = {
//       nodes: {},
//       datesSorted: [],
//   }

//   return trie;
// }

exports.create = async (req, res) => {
  try {
    await invoiceService.createInvoice(req.body)
    res.status(200).json({ message: 'Invoice created' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.edit = async (req, res) => {
  try {
    await invoiceService.editInvoice(req.body)
    res.status(200).json({ message: 'Invoice updated successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.delete = async (req, res) => {
  try {
    await invoiceService.deleteInvoice(req.params.invoiceId)
    res.status(200).json({ message: 'Invoice deleted successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.send = async (req, res) => {
  try {
    await invoiceService.sendInvoice(req.params.invoiceId)
    res.status(200).json({ message: 'Message sent successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.retrieve = async (req, res) => {
  try {
    const invoice = await invoiceService.retrieveInvoice(req.params.invoiceId)
    res.status(200).json({ invoice })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.validate = async (req, res) => {
  try {
    console.log(req.body)
    await invoiceService.validateInvoice(req.body)
    res.status(200).json({ message: 'Invoice is valid' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.search = async (req, res) => {
  try {
    const results = await invoiceService.searchInvoices(req.params.input)
    res.status(200).json({ results })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
