const request = require('supertest')
const { app, server } = require('../../api/server')
const User = require('../../api/models/UsersModel')
const Invoice = require('../../api/models/InvoiceModel')
const Business = require('../../api/models/BusinessModel')
const Client = require('../../api/models/ClientModel')
const mongoose = require('mongoose') // Import mongoose for DB teardown
server.close()

describe('GET /invoices/:invoiceId', () => {
  afterAll(async () => {
    await mongoose.connection.close() // Ensure DB connection is closed
    server.close()
  })

  it('should retrieve an invoice and return successfully', async () => {
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

    const response4 = await request(app)
      .get(`/invoice/${newInvoice.invoiceNo}`)
      .send(newInvoice.invoiceNo)

    const expectedResult = {
      invoiceNo: 'Testing',
      date: '2025-03-13T00:00:00.000Z',
      productDetail: 'DELL Monitor',
      productFee: 250,
      productGst: 25,
      productTotal: 275,
      business,
      client
    }

    const response4Result = {
      invoiceNo: response4.body.invoice.invoiceNo,
      date: response4.body.invoice.date,
      productDetail: response4.body.invoice.productDetail,
      productFee: parseInt(response4.body.invoice.productFee, 10),
      productGst: parseInt(response4.body.invoice.productGst, 10),
      productTotal: parseInt(response4.body.invoice.productTotal, 10),
      business: {
        busName: response4.body.invoice.business.busName
      },
      client: {
        recepientName: response4.body.invoice.client.recepientName
      }
    }

    expect(JSON.stringify(response4Result)).toBe(JSON.stringify(expectedResult))

    await User.findOneAndDelete({ username: newUser.username })
    await Invoice.findOneAndDelete({ invoiceNo: newInvoice.invoiceNo })
    await Business.findOneAndDelete({ busName: business.busName })
    await Client.findOneAndDelete({ recepientName: client.recepientName })
  })
})

// const request = require('supertest')
// const { app, server } = require('../../main/server')
// const User = require('../../main/models/UsersModel')
// const Invoice = require('../../main/models/InvoiceModel')
// const Business = require('../../main/models/BusinessModel')
// const Client = require('../../main/models/ClientModel')
// const mongoose = require('mongoose') // Import mongoose for DB teardown

// describe('GET /invoices/:invoiceId', () => {
//   afterAll(async () => {
//     await mongoose.connection.close() // Ensure DB connection is closed
//   })

//   it('should retrieve an invoice and return successfully', async () => {
//     const newUser = {
//         username: 'Billy',
//         email: 'billy@gmail.com',
//         password: 'Password123!'
//     }

//     await User.findOneAndDelete({"username" : newUser.username})

//     const response = await request(app)
//     .post('/user/signup')
//     .send(newUser)
//     .expect(200)

//     expect(response.body.message).toBe('Signup successful')

//     const newLogin = {
//         email: 'billy@gmail.com',
//         password: 'Password123!'
//     }

//     const response2 = await request(app)
//     .post('/user/login')
//     .send(newLogin)
//     .expect(200)

//     expect(response2.body.message).toBe('Login successful')

//     const client = {
//         recepientName: 'Name'
//     }

//     const business = {
//         busName: 'Bruh'
//     }

//     const newInvoice = {
//         invoiceNo: 'Testing',
//         date: '2025-03-13T00:00:00.000Z',
//         productDetail: 'DELL Monitor',
//         productFee: 250,
//         productGst: 25,
//         productTotal: 275,
//         business: business,
//         client: client
//     }

//     await Invoice.findOneAndDelete({ "invoiceNo" : newInvoice.invoiceNo })
//     await Business.findOneAndDelete({ "busName" : business.busName })
//     await Client.findOneAndDelete({ "recepientName" : client.recepientName})

//     const response3 = await request(app)
//     .post('/invoice/create')
//     .send(newInvoice)
//     .expect(200)

//     expect(response3.body.message).toBe('Invoice created')

//     const response4 = await request(app)
//                         .get(`/invoice/${newInvoice.invoiceNo}`)
//                         .send(newInvoice.invoiceNo)

//     const expectedResult = {
//         invoiceNo: 'Testing',
//         date: '2025-03-13T00:00:00.000Z',
//         productDetail: 'DELL Monitor',
//         productFee: 250,
//         productGst: 25,
//         productTotal: 275,
//         business: business,
//         client: client
//     }

//     const response4Result = {
//         invoiceNo: response4.body.invoice.invoiceNo,
//         date: response4.body.invoice.date,
//         productDetail: response4.body.invoice.productDetail,
//         productFee: parseInt(response4.body.invoice.productFee),
//         productGst: parseInt(response4.body.invoice.productGst),
//         productTotal: parseInt(response4.body.invoice.productTotal),
//         business: {
//             busName: response4.body.invoice.business.busName
//         },
//         client: {
//             recepientName: response4.body.invoice.client.recepientName
//         }
//     }

//     expect(JSON.stringify(response4Result)).toBe(JSON.stringify(expectedResult))
//   })

// //   it('should return an error as the token is invalid', async () => {
// //     const newUser = {
// //       username: 'Billy Bob',
// //       email: 'billybob@gmail.com',
// //       password: 'Password123!'
// //     }

// //     const response = await request(app)
// //       .post('/user/signup')
// //       .send(newUser)
// //       .expect(201)

// //     expect(response.body.message).toBe('Signup successful')

// //     const newLogin = {
// //       email: 'billybob@gmail.com',
// //       password: 'Password123!'
// //     }

// //     const response2 = await request(app)
// //       .post('/user/login')
// //       .send(newLogin)
// //       .expect(200)

// //     expect(response2.body.message).toBe('Login successful')

// //     const client = {
// //         recepientName: 'Name'
// //       }

// //     const business = {
// //         busName: 'Bruh'
// //       }

// //     const newInvoice = {
// //     invoiceNo: 'Testing',
// //     date: '2025-03-13T00:00:00.000Z',
// //     productDetail: 'DELL Monitor',
// //     productFee: 250,
// //     productGst: 25,
// //     productTotal: 275,
// //     business: business,
// //     client: client
// //     }

// //     await Invoice.findOneAndDelete({ "invoiceNo" : newInvoice.invoiceNo })
// //     await Business.findOneAndDelete({ "busName" : business.busName })
// //     await Client.findOneAndDelete({ "recepientName" : client.recepientName})

// //     const response3 = await request(app)
// //       .post('/invoices')
// //       .send(newInvoice)
// //       .expect(201)

// //     expect(response3.body.message).toBe('Invoice created')

// //     const response4 = await request(app)
// //       .get(`/invoices/${response3.body.invoice._id}`)
// //       .expect(400)
// //     expect(response4.body.error).toBe('Token is invalid')
// //   })

// //   it('should error as the invoice has been deleted', async () => {
// //     const newUser = {
// //       username: 'Billy Bob',
// //       email: 'billybob@gmail.com',
// //       password: 'Password123!'
// //     }

// //     const response = await request(app)
// //       .post('/user/signup')
// //       .send(newUser)
// //       .expect(201)

// //     expect(response.body.message).toBe('Signup successful')

// //     const newLogin = {
// //       email: 'billybob@gmail.com',
// //       password: 'Password123!'
// //     }

// //     const response2 = await request(app)
// //       .post('/user/login')
// //       .send(newLogin)
// //       .expect(200)

// //     expect(response2.body.message).toBe('Login successful')

// //     const newInvoice = {
// //       invoiceNo: 'Test Invoice',
// //       date: '2025-03-13T00:00:00.000Z',
// //       productDetail: 'DELL Monitor',
// //       productFee: 250,
// //       productGst: 25,
// //       productTotal: 275
// //     }

// //     const response3 = await request(app)
// //       .post('/invoices')
// //       .send(newInvoice)
// //       .expect(200)

// //     expect(response3.body.message).toBe('Invoice created')

// //     await Invoice.findByIdAndDelete(response3.body.invoice._id) // Remove test invoice

// //     const response4 = await request(app)
// //       .get(`/invoices/${response3.body.invoice._id}`)
// //       .expect(400)

// //     expect(response4.body.message).toBe('Invoice does not exist')

// //     await User.findByIdAndDelete(response.body.user._id) // Remove test user
// //   })
// })
