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

  it('should send the invoice and return successfully', async () => {
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

    const message = {
      title: 'Test Message',
      emailAddress: 'joebloe@hotmail.com',
      message: 'Hi this is a test message! Pls reply to me!'
    }

    const response4 = await request(app)
      .post(`/invoice/${newInvoice.invoiceNo}`)
      .send(message)
      .expect(200)

    expect(response4.body.message).toBe('Message sent successfully')
  })

  it('should error as the invoice has been deleted', async () => {
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

    await Invoice.findOneAndDelete({ invoiceNo: newInvoice.invoiceNo })
    await Business.findOneAndDelete({ busName: business.busName })
    await Client.findOneAndDelete({ recepientName: client.recepientName })

    const message = {
      title: 'Test Message',
      emailAddress: 'joebloe@hotmail.com',
      message: 'Hi this is a test message! Pls reply to me!'
    }

    const response4 = await request(app)
      .post(`/invoice/${newInvoice.invoiceNo}`)
      .send(message)
      .expect(400)

    expect(response4.body.error).toBe('Invoice does not exist')
  })
})

// const request = require('supertest')
// const { app, server } = require('../../main/server')
// const User = require('../../main/models/UsersModel')
// const Invoice = require('../../main/models/InvoiceModel')
// const Business = require('../../main/models/BusinessModel')
// const Client = require('../../main/models/ClientModel')
// const mongoose = require('mongoose') // Import mongoose for DB teardown

// describe('POST /invoices/:invoiceId', () => {
//   afterAll(async () => {
//     await mongoose.connection.close() // Ensure DB connection is closed
//   })

//   it('should send the invoice and return successfully', async () => {
//     const newUser = {
//         username: 'Billy',
//         email: 'billy@gmail.com',
//         password: 'Password123!'
//     }

//     await User.findOneAndDelete({"username" : newUser.username})

//     const response = await request(app)
//                           .post('/user/signup')
//                           .send(newUser)
//                           .expect(200)

//     expect(response.body.message).toBe('Signup successful')

//     const newLogin = {
//         email: 'billy@gmail.com',
//         password: 'Password123!'
//     }

//     const response2 = await request(app)
//                             .post('/user/login')
//                             .send(newLogin)
//                             .expect(200)

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
//                           .post('/invoice/create')
//                           .send(newInvoice)
//                           .expect(200)

//     expect(response3.body.message).toBe('Invoice created')

//     const message = {
//       title: 'Test Message',
//       emailAddress: 'joebloe@hotmail.com',
//       message: 'Hi this is a test message! Pls reply to me!'
//     }

//     const response4 = await request(app)
//       .post(`/invoice/${newInvoice.invoiceNo}`)
//       .send(message)
//       .expect(200)

//     expect(response4.body.message).toBe('Message sent successfully')
//   })

//   it('should error as the invoice has been deleted', async () => {
//     const newUser = {
//       username: 'Billy',
//       email: 'billy@gmail.com',
//       password: 'Password123!'
//     }

//     await User.findOneAndDelete({"username" : newUser.username})

//     const response = await request(app)
//                           .post('/user/signup')
//                           .send(newUser)
//                           .expect(200)

//     expect(response.body.message).toBe('Signup successful')

//     const newLogin = {
//         email: 'billy@gmail.com',
//         password: 'Password123!'
//     }

//     const response2 = await request(app)
//                             .post('/user/login')
//                             .send(newLogin)
//                             .expect(200)

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

//     await Invoice.findOneAndDelete({ "invoiceNo" : newInvoice.invoiceNo })
//     await Business.findOneAndDelete({ "busName" : business.busName })
//     await Client.findOneAndDelete({ "recepientName" : client.recepientName})

//     const message = {
//       title: 'Test Message',
//       emailAddress: 'joebloe@hotmail.com',
//       message: 'Hi this is a test message! Pls reply to me!'
//     }

//     const response4 = await request(app)
//       .post(`/invoice/${newInvoice.invoiceNo}`)
//       .send(message)
//       .expect(400)

//     expect(response4.body.error).toBe('Invoice does not exist')
//   })

//   // it('should error as the token is invalid', async () => {
//   //   const newUser = {
//   //     username: 'Billy Bob',
//   //     email: 'billybob@gmail.com',
//   //     password: 'Password123!'
//   //   }

//   //   const response = await request(app)
//   //     .post('/user/signup')
//   //     .send(newUser)
//   //     .expect(201)

//   //   expect(response.body.message).toBe('Signup successful')

//   //   const newLogin = {
//   //     email: 'billybob@gmail.com',
//   //     password: 'Password123!'
//   //   }

//   //   const response2 = await request(app)
//   //     .post('/user/login')
//   //     .send(newLogin)
//   //     .expect(200)

//   //   expect(response2.body.message).toBe('Login successful')

//   //   const newInvoice = {
//   //     invoiceNo: 'Test Invoice',
//   //     date: '2025-03-13T00:00:00.000Z',
//   //     productDetail: 'DELL Monitor',
//   //     productFee: 250,
//   //     productGst: 25,
//   //     productTotal: 275
//   //   }

//   //   const response3 = await request(app)
//   //     .post('/invoices')
//   //     .send(newInvoice)
//   //     .expect(200)

//   //   expect(response3.body.message).toBe('Invoice created')

//   //   await User.findByIdAndDelete(response.body.user._id) // Remove test user

//   //   const message = {
//   //     title: 'Test Message',
//   //     emailAddress: 'joebloe@hotmail.com',
//   //     message: 'Hi this is a test message! Pls reply to me!'
//   //   }

//   //   const response4 = await request(app)
//   //     .post(`/invoices/${response3.body.invoice._id}`)
//   //     .send(message)
//   //     .expect(400)

//   //   expect(response4.body.error).toBe('Token is invalid')

//   //   await Invoice.findByIdAndDelete(response3.body.invoice._id) // Remove test invoice
//   // })
// })
