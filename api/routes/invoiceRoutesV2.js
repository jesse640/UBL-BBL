const express = require('express')
const router = express.Router()
const tokenController = require('../controllers/tokenAuth')
const InvoiceV2 = require('../models/InvoiceModelV2')
// const nodemailer = require('nodemailer')

const validator = require('xsd-schema-validator')
const path = require('path')
const { create } = require('xmlbuilder2')
const xml2js = require('xml2js')

const fs = require('fs/promises')
const util = require('util')
const { exec } = require('child_process')
const execPromise = util.promisify(exec)

// middleware
router.use(express.text({ type: 'application/xml' }))

// converts order XML to JSON
router.post('/parseOrder2json', (req, res) => {
  const orderXml = req.body

  const parser = new xml2js.Parser()

  // Parse the XML string into JSON
  parser.parseString(orderXml, (err, result) => {
    if (err) {
      return res.status(400).json({ error: 'Invalid XML format' })
    }

    // Extract data from the parsed XML and assign to the desired JSON structure
    const orderData = result.Order

    const jsonResponse = {
      id: orderData['cbc:ID'][0],
      issueDate: orderData['cbc:IssueDate'][0],
      startDate: orderData['cac:Delivery'][0]['cac:RequestedDeliveryPeriod'][0]['cbc:StartDate'][0],
      endDate: orderData['cac:Delivery'][0]['cac:RequestedDeliveryPeriod'][0]['cbc:EndDate'][0],
      supplier: orderData['cac:SellerSupplierParty'][0]['cac:Party'][0]['cac:PartyName'][0]['cbc:Name'][0],
      customer: orderData['cac:BuyerCustomerParty'][0]['cac:Party'][0]['cac:PartyName'][0]['cbc:Name'][0],
      currency: orderData['cac:AnticipatedMonetaryTotal'][0]['cbc:PayableAmount'][0].$.currencyID,
      totalAmount: orderData['cac:AnticipatedMonetaryTotal'][0]['cbc:PayableAmount'][0]._,
      items: orderData['cac:OrderLine'].map(line => ({
        description: line['cac:LineItem'][0]['cac:Item'][0]['cbc:Description'][0],
        amount: line['cac:LineItem'][0]['cbc:LineExtensionAmount'][0]._
      }))
    }

    // Return the formatted JSON response
    return res.status(200).json(jsonResponse)
  })
})

// creating invoice xml from user inputs
router.post('/create', tokenController.tokenAuth, async (req, res) => {
  const invoice = req.body

  if (!invoice || !invoice.id || !invoice.issueDate || !invoice.supplier || !invoice.customer || !invoice.totalAmount) {
    return res.status(400).json({ error: 'Missing required invoice fields' })
  }

  const invoiceExists = await InvoiceV2.findOne({ invoiceId: invoice.id })
  if (invoiceExists) {
    return res.status(400).json({ error: 'InvoiceId already in use' })
  }

  try {
    // Build the XML Invoice
    const xmlDoc = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('Invoice', {
        xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
        'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
        'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2'
      })
      .ele('cbc:ID').txt(invoice.id).up()
      .ele('cbc:IssueDate').txt(invoice.issueDate).up()
      .ele('cac:InvoicePeriod')
      .ele('cbc:StartDate').txt(invoice.startDate).up()
      .ele('cbc:EndDate').txt(invoice.endDate).up()
      .up()
      .ele('cac:AccountingSupplierParty')
      .ele('cac:Party')
      .ele('cac:PartyName')
      .ele('cbc:Name').txt(invoice.supplier).up()
      .up()
      .up()
      .up()
      .ele('cac:AccountingCustomerParty')
      .ele('cac:Party')
      .ele('cac:PartyName')
      .ele('cbc:Name').txt(invoice.customer).up()
      .up()
      .up()
      .up()
      .ele('cac:LegalMonetaryTotal')
      .ele('cbc:PayableAmount', { currencyID: invoice.currency || 'CAD' }).txt(invoice.totalAmount).up()
      .up()

    // Add invoice lines
    invoice.items.forEach((item, index) => {
      xmlDoc.ele('cac:InvoiceLine')
        .ele('cbc:ID').txt(index + 1).up()
        .ele('cbc:InvoicedQuantity', { unitCode: 'EA' }).txt(item.quantity).up()
        .ele('cbc:LineExtensionAmount', { currencyID: invoice.currency || 'CAD' }).txt(item.amount).up()
        .ele('cac:Item')
        .ele('cbc:Description').txt(item.description).up()
        .up()
        .up()
    })

    const xmlString = xmlDoc.end({ prettyPrint: true }) // Convert to formatted XML string

    await InvoiceV2.create({
      userId: req.user.userId,
      invoiceId: invoice.id,
      invoiceXML: xmlString
    }) // when creating the invoice here its failing

    res.status(200).json({ message: 'Invoice created' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate invoice XML', details: error.message })
  }
})

// validation with UBL-Invoice-2.1.xsd
router.post('/validate/UBL-Invoice-2.1', async (req, res) => {
  const invoiceXml = req.body

  if (!invoiceXml) {
    return res.status(400).json({ error: 'No XML data received' })
  }

  try {
    // validate UBL-invoice-2.1.xsd
    const xsdFilePath = path.join(__dirname, '../validation/UBL-Invoice-2.1.xsd')
    const result = await validator.validateXML(invoiceXml, xsdFilePath)

    res.status(200).json({ valid: result.valid, message: 'invoice is valid' })
  } catch (error) {
    res.status(400).json({ valid: error.valid, errors: error.messages })
  }
})

// validation with AUNZ-UBL-validation and AUNZ-PEPPOL-validation
router.post('/validate/A-NZ-PEPPOL', async (req, res) => {
  try {
    const invoiceXml = req.body
    const invoicefilePath = path.resolve(__dirname, '../tempFiles/invoice.xml')
    const sefJsonFilePath = path.resolve(__dirname, '../validation/AUNZ-UBL-validation.sef.json')
    const sefJsonFilePathPeppol = path.resolve(__dirname, '../validation/AUNZ-PEPPOL-validation.sef.json')
    const outputFilePath = path.resolve(__dirname, '../tempFiles/output.xml')

    await fs.writeFile(invoicefilePath, invoiceXml)

    const command1 = `npx xslt3 -xsl:${sefJsonFilePath} -s:${invoicefilePath} -o:${outputFilePath}`
    await execPromise(command1)
    const output1 = await fs.readFile(outputFilePath, 'utf8')

    const command2 = `npx xslt3 -xsl:${sefJsonFilePathPeppol} -s:${invoicefilePath} -o:${outputFilePath}`
    await execPromise(command2)
    const output2 = await fs.readFile(outputFilePath, 'utf8')
    const output = output1 + '\n' + output2
    const regex = /<svrl:text>(.*?)<\/svrl:text>/gs
    const matches = [...output.matchAll(regex)].map(match => match[1])

    if (matches.length === 0) {
      return res.status(200).json({ message: 'valid AUNZ PEPPOL' })
    }

    return res.status(400).json({ message: 'invalid AUNZ PEPPOL', errors: matches })
  } catch (error) {
    return res.status(500).json({ message: 'invalid xml', error: error.message })
  }
})

// gets list of all invoices
router.get('/list', tokenController.tokenAuth, async (req, res) => {
  try {
    const invoiceIds = await InvoiceV2.find(
      { userId: req.user.userId },
      'invoiceId'
    )
    res.status(200).json(invoiceIds)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invoices', details: err.message })
  }
})

// gets info for specific invoice
router.get('/:invoiceId', tokenController.tokenAuth, async (req, res) => {
  const invoiceId = req.params.invoiceId

  try {
    const invoice = await InvoiceV2.findOne({
      invoiceId,
      userId: req.user.userId
    })

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' })
    }

    res.status(200).json(invoice)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invoice', details: err.message })
  }
})

// deletes a specific invoice
router.delete('/:invoiceId', tokenController.tokenAuth, async (req, res) => {
  const invoiceId = req.params.invoiceId

  try {
    // Find and delete the invoice, ensuring it belongs to the authenticated user
    const result = await InvoiceV2.findOneAndDelete({
      invoiceId,
      userId: req.user.userId
    })

    // Check if an invoice was actually deleted
    if (!result) {
      return res.status(404).json({ error: 'Invoice not found or unauthorized' })
    }

    res.status(200).json({ message: `Invoice ${invoiceId} successfully deleted` })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete invoice', details: err.message })
  }
})

// // sends selected invoice to an email
// router.post('/send', tokenController.tokenAuth, async (req, res) => {
//   const { email, invoiceId } = req.body

//   if (!email || !invoiceId) {
//     return res.status(400).json({ error: 'Email and invoiceId are required' })
//   }

//   try {
//     // Find invoice by invoiceNo and ensure it belongs to the user
//     const invoice = await InvoiceV2.findOne({
//       invoiceNo: invoiceId,
//       userId: req.user.userId
//     })

//     if (!invoice) {
//       return res.status(404).json({ error: 'Invoice not found or unauthorized' })
//     }

//     // Set up email transport (example using Gmail, use ENV vars in prod)
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: req.user.email,
//         pass: 'your-app-password'
//       }
//     })

//     // Send the email with the invoice XML as attachment
//     await transporter.sendMail({
//       from: '"Your Company" <your.email@gmail.com>',
//       to: email,
//       subject: `Invoice ${invoice.invoiceId}`,
//       text: `Attached is your invoice ${invoice.invoiceId}`,
//       attachments: [
//         {
//           filename: `invoice-${invoice.invoiceId}.xml`,
//           content: invoice.invoiceXML,
//           contentType: 'application/xml'
//         }
//       ]
//     })

//     res.status(200).json({ message: `Invoice ${invoice.invoiceNo} sent to ${email}` })

//   } catch (err) {
//     res.status(500).json({ error: 'Failed to send invoice', details: err.message })
//   }
// })

module.exports = router
