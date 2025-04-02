const express = require('express')
const router = express.Router()

// have to reinstall npm install xsd-schema-validator
// const validator = require('xsd-schema-validator')
const path = require('path')
const { create } = require('xmlbuilder2') // XML builder
const xml2js = require('xml2js')

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
router.post('/create', (req, res) => {
  const invoice = req.body

  if (!invoice || !invoice.id || !invoice.issueDate || !invoice.supplier || !invoice.customer || !invoice.totalAmount) {
    return res.status(400).json({ error: 'Missing required invoice fields' })
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
        .ele('cbc:LineExtensionAmount', { currencyID: invoice.currency || 'CAD' }).txt(item.amount).up()
        .ele('cac:Item')
        .ele('cbc:Description').txt(item.description).up()
        .up()
        .up()
    })

    const xmlString = xmlDoc.end({ prettyPrint: true }) // Convert to formatted XML string

    res.setHeader('Content-Type', 'application/xml')
    res.status(200).send(xmlString)
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate invoice XML', details: error.message })
  }
})

// uncomment when xsd-schema-validator is accepted by railway

// validation with UBL-Invoice-2.1.xsd
// router.post('/validate', async (req, res) => {
//   const invoiceXml = req.body

//   if (!invoiceXml) {
//     return res.status(400).json({ error: 'No XML data received' })
//   }

//   try {
//     // validate UBL-invoice-2.1.xsd
//     const xsdFilePath = path.join(__dirname, '../validation/UBL-Invoice-2.1.xsd')
//     const result = await validator.validateXML(invoiceXml, xsdFilePath)

//     res.status(200).json({ valid: result.valid, message: 'invoice is valid' })
//   } catch (error) {
//     res.status(400).json({ valid: error.valid, messages: error.messages })
//   }
// })

module.exports = router

// // validation with AUNZ-UBL-validation.sch
// router.post('/validate2', async (req, res) => {
//   const invoiceXml = req.body

//   if (!invoiceXml) {
//     return res.status(400).json({ error: 'No XML data received' })
//   }

//   try {
//     // Load precompiled Schematron XSLT
//     const xsltFilePath = path.join(__dirname, '../validation/AUNZ-UBL-validation.xslt')
//     const xsltContent = fs.readFileSync(xsltFilePath, 'utf8')

//     // Compile XSLT to SEF
//     const sef = SaxonJS.compile({
//       stylesheetText: xsltContent
//     })

//     // Save the SEF file
//     const sefFilePath = path.join(__dirname, '../validation/AUNZ-UBL-validation.sef.json')
//     fs.writeFileSync(sefFilePath, JSON.stringify(sef))

//     // // Apply the XSLT transformation to validate XML
//     // const result = SaxonJS.transform({
//     //     stylesheetText: xsltContent,
//     //     sourceText: invoiceXml,
//     //     destination: 'serialized'
//     // })

//     // Parse validation result
//     // const errors = parseSchematronOutput(result.principalResult)

//     // if (errors.length === 0) {
//     //     return res.status(200).json({ valid: true, message: 'Invoice is valid' })
//     // } else {
//     //     return res.status(400).json({ valid: false, messages: errors })
//     // }

//     res.status(200).json({ message: 'invoice is valid' })
//   } catch (error) {
//     return res.status(500).json(error)
//   }
// })

// // Parses Schematron validation output (adjust as needed)
// function parseSchematronOutput (outputXml) {
//   const errors = []
//   const matches = outputXml.match(/<svrl:failed-assert[^>]*>([\s\S]*?)<\/svrl:failed-assert>/g)
//   if (matches) {
//     matches.forEach(match => {
//       const messageMatch = match.match(/<svrl:text[^>]*>([\s\S]*?)<\/svrl:text>/)
//       if (messageMatch) errors.push(messageMatch[1].trim())
//     })
//   }
//   return errors
// }
