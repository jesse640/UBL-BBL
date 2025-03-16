require('dotenv').config()
const Invoice = require('../models/InvoiceModel')
const Business = require('../models/BusinessModel')
const Client = require('../models/ClientModel')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

// const emailjs = require('@emailjs/browser')

// ==============================================================================
// Invoices
// ==============================================================================
exports.createInvoice = async (invoice) => {
  const invoiceId = invoice.invoiceNo
  const invoiceExists = await Invoice.findOne({ invoiceNo: invoiceId })
  if (invoiceHasMissingFields(invoice)) {
    throw new Error('Invoice has missing fields')
  } else if (invoiceExists) {
    throw new Error('Another invoice has the same id!')
  } else if (!numericFieldsAreNumeric(invoice)) {
    throw new Error('Product fees must be numbers')
  } else if (invoice.business.busName === '' || invoice.client.recepientName === '') {
    throw new Error('Missing fields')
  } else {
    invoice.business = await Business.create(invoice.business)
    invoice.client = await Client.create(invoice.client)
    await Invoice.create(invoice)
  }
}

exports.editInvoice = async (invoice) => {
  const invoiceId = invoice.invoiceNo
  const invoiceExists = await Invoice.findOne({ invoiceNo: invoiceId })
  if (!invoiceExists) {
    throw new Error('Invoice does not exist')
  } else if (!numericFieldsAreNumeric(invoice)) {
    throw new Error('Product fees must be numbers')
  } else {
    const business = await Business.findById(invoiceExists.business)
    const client = await Client.findById(invoiceExists.client)

    await Business.findByIdAndUpdate(business._id, invoice.business)
    await Client.findByIdAndUpdate(client._id, invoice.client)

    invoice.business = invoiceExists.business
    invoice.client = invoiceExists.client

    await Invoice.findByIdAndUpdate(invoiceExists._id, invoice)
  }
}

exports.deleteInvoice = async (invoiceId) => {
  const invoiceExists = await Invoice.findOne({ invoiceNo: invoiceId })
  if (!invoiceExists) {
    throw new Error('Invoice does not exist')
  } else {
    const business = await Business.findById(invoiceExists.business)
    const client = await Client.findById(invoiceExists.client)
    await Business.findByIdAndDelete(business._id)
    await Client.findByIdAndDelete(client._id)
    await Invoice.findByIdAndDelete(invoiceExists._id)
  }
}

exports.sendInvoice = async (invoiceId) => {
  const invoiceExists = await Invoice.findOne({ invoiceNo: invoiceId })
  if (!invoiceExists) {
    throw new Error('Invoice does not exist')
  } else {
    // Send invoice logic:

    // emailjs.init("Public key to indicate account on email.js")
    // const serviceId = "ServiceId"
    // const templateId = "TemplateId"
    // const emailParams = {
    //   invoiceId: invoice.generalDetails.invoiceId,
    //   date: invoice.generalDetails.date,
    //   name: invoice.businessDetails.name,
    //   address: invoice.businessDetails.address,
    //   email: invoice.businessDetails.email,
    //   phoneNumber: invoice.businessDetails.phoneNumber,
    //   abn: invoice.businessDetails.abn,
    //   paymentDetails: invoice.businessDetails.paymentDetails,
    //   total: invoice.total,
    // }
    //
    // emailjs
    //   .send(serviceId, templateId, emailParams)
    //   .then((response) => console.log("Invoice sent successfully!"))
    //   .catch((error) => console.log("Failed to send invoice."))
  }
}

exports.retrieveInvoice = async (invoiceId) => {
  const invoiceExists = await Invoice.findOne({ invoiceNo: invoiceId })
  if (!invoiceExists) {
    throw new Error('Invoice does not exist')
  } else {
    const business = await Business.findById(invoiceExists.business)
    const client = await Client.findById(invoiceExists.client)
    invoiceExists.business = business
    invoiceExists.client = client
    return invoiceExists
  }
}

exports.searchInvoices = async (input) => {
  const regex = new RegExp(`^${input}`)
  const results = await Invoice.find({ invoiceNo: regex })
  if (results.length === 0) {
    throw new Error('No results')
  } else {
    return results
  }
}

exports.validateInvoice = async () => {}

function invoiceHasMissingFields (invoice) {
  const requiredFields = [
    'invoiceNo',
    'date',
    'productDetail',
    'productFee',
    'productGst',
    'productTotal',
    'client',
    'business'
  ]
  return requiredFields.some((field) => !(field in invoice))
}

function numericFieldsAreNumeric (invoice) {
  return typeof invoice.productFee === 'number' && typeof invoice.productGst === 'number'
}
