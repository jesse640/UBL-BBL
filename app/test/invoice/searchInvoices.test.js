const request = require('supertest')
const { app, server } = require('../../api/server')
const User = require('../../api/models/UsersModel')
const Invoice = require('../../api/models/InvoiceModel')
const Business = require('../../api/models/BusinessModel')
const Client = require('../../api/models/ClientModel')
const mongoose = require('mongoose') // Import mongoose for DB teardown
server.close()

describe('POST /invoices/:invoiceId', () => {
  afterAll(async () => {
    await mongoose.connection.close() // Ensure DB connection is closed
    server.close()
  })

  it('should search and return all invoices starting with the input given', async () => {
    const newUser = {
      username: 'Billy',
      email: 'billy@gmail.com',
      password: 'Password123!'
    }

    await User.findOneAndDelete({ username: newUser.username })

    const response = await request(app)
      .post('/user/signup')
      .send(newUser)
      .expect(201)

    expect(response.body.message).toBe('Signup successful')

    const newLogin = {
      email: 'billy@gmail.com',
      password: 'Password123!'
    }

    const response2 = await request(app)
      .post('/user/login')
      .send(newLogin)
      .expect(200)

    expect(response2.body.message).toBe('Login successful')

    const client = { recepientName: 'Name' }
    const business = { busName: 'Bruh' }

    const newInvoice = {
      invoiceNo: 'Testing',
      date: '2025-03-13T00:00:00.000Z',
      productDetail: 'DELL Monitor',
      productFee: 250,
      productGst: 25,
      productTotal: 275,
      business,
      client
    }

    await Invoice.findOneAndDelete({ invoiceNo: newInvoice.invoiceNo })
    await Business.findOneAndDelete({ busName: business.busName })
    await Client.findOneAndDelete({ recepientName: client.recepientName })

    const response3 = await request(app)
      .post('/invoice/create')
      .send(newInvoice)
      .expect(200)

    expect(response3.body.message).toBe('Invoice created')

    const client2 = { recepientName: 'Name' }
    const business2 = { busName: 'Bruh' }

    const newInvoice2 = {
      invoiceNo: 'Tester',
      date: '2025-03-13T00:00:00.000Z',
      productDetail: 'DELL Monitor',
      productFee: 250,
      productGst: 25,
      productTotal: 275,
      business: business2,
      client: client2
    }

    await Invoice.findOneAndDelete({ invoiceNo: newInvoice2.invoiceNo })
    await Business.findOneAndDelete({ busName: business2.busName })
    await Client.findOneAndDelete({ recepientName: client2.recepientName })

    const response4 = await request(app)
      .post('/invoice/create')
      .send(newInvoice2)
      .expect(200)

    expect(response4.body.message).toBe('Invoice created')

    const input = 'Test'
    const response5 = await request(app)
      .get(`/invoice/search/${input}`)
      .send()
      .expect(200)

    const result = []
    for (const invoice of response5.body.results) {
      result.push(invoice.invoiceNo)
    }
    const expected = ['Testing', 'Tester']

    expect(result).toEqual(expected)
  })

  it('should error as there are no invoices starting with the given string', async () => {
    const newUser = {
      username: 'Billy',
      email: 'billy@gmail.com',
      password: 'Password123!'
    }

    await User.findOneAndDelete({ username: newUser.username })

    const response = await request(app)
      .post('/user/signup')
      .send(newUser)
      .expect(201)

    expect(response.body.message).toBe('Signup successful')

    const newLogin = {
      email: 'billy@gmail.com',
      password: 'Password123!'
    }

    const response2 = await request(app)
      .post('/user/login')
      .send(newLogin)
      .expect(200)

    expect(response2.body.message).toBe('Login successful')

    const client = { recepientName: 'Name' }
    const business = { busName: 'Bruh' }

    const newInvoice = {
      invoiceNo: 'Testing',
      date: '2025-03-13T00:00:00.000Z',
      productDetail: 'DELL Monitor',
      productFee: 250,
      productGst: 25,
      productTotal: 275,
      business,
      client
    }

    await Invoice.findOneAndDelete({ invoiceNo: newInvoice.invoiceNo })
    await Business.findOneAndDelete({ busName: business.busName })
    await Client.findOneAndDelete({ recepientName: client.recepientName })

    const response3 = await request(app)
      .post('/invoice/create')
      .send(newInvoice)
      .expect(200)

    expect(response3.body.message).toBe('Invoice created')

    const client2 = { recepientName: 'Name' }
    const business2 = { busName: 'Bruh' }

    const newInvoice2 = {
      invoiceNo: 'Tester',
      date: '2025-03-13T00:00:00.000Z',
      productDetail: 'DELL Monitor',
      productFee: 250,
      productGst: 25,
      productTotal: 275,
      business: business2,
      client: client2
    }

    await Invoice.findOneAndDelete({ invoiceNo: newInvoice2.invoiceNo })
    await Business.findOneAndDelete({ busName: business2.busName })
    await Client.findOneAndDelete({ recepientName: client2.recepientName })

    const response4 = await request(app)
      .post('/invoice/create')
      .send(newInvoice2)
      .expect(200)

    expect(response4.body.message).toBe('Invoice created')

    const input = 'Lol'
    const response5 = await request(app)
      .get(`/invoice/search/${input}`)
      .send()
      .expect(400)
    expect(response5.body.error).toEqual('No results')
  })
})
