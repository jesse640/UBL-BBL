const request = require('supertest')
const { app, server } = require('../../api/server')
const User = require('../../api/models/UsersModel')
const Invoice = require('../../api/models/InvoiceModel')
const Business = require('../../api/models/BusinessModel')
const Client = require('../../api/models/ClientModel')
const mongoose = require('mongoose') // Import mongoose for DB teardown
server.close()

describe('POST /invoices', () => {
  afterAll(async () => {
    await mongoose.connection.close() // Ensure DB connection is closed
    server.close()
  })

  it('should create a new invoice and return successfully', async () => {
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

    await User.findOneAndDelete({ username: newUser.username })
  })

  it('should return an error when the product fees are not numbers', async () => {
    const newUser = {
      username: 'Bill',
      email: 'billybob@gmail.com',
      password: 'Password123!'
    }

    await User.findOneAndDelete({ username: newUser.username })

    const response = await request(app)
      .post('/user/signup')
      .send(newUser)
      .expect(201)

    expect(response.body.message).toBe('Signup successful')

    const newLogin = {
      email: 'billybob@gmail.com',
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
      invoiceNo: 'Test Invoice',
      date: '2025-03-13T00:00:00.000Z',
      productDetail: 'DELL Monitor',
      productFee: 'notanumber',
      productGst: 'stillnotanumber',
      productTotal: 'pretendnumber',
      business,
      client
    }

    await Invoice.findOneAndDelete({ invoiceNo: newInvoice.invoiceNo })
    await Business.findOneAndDelete({ busName: business.busName })
    await Client.findOneAndDelete({ recepientName: client.recepientName })

    const response3 = await request(app)
      .post('/invoice/create')
      .send(newInvoice)
      .expect(400)

    expect(response3.body.error).toBe('Product fees must be numbers')
  })

  it('should return an error when not all fields are filled out', async () => {
    const newUser = {
      username: 'Bill',
      email: 'billybob@gmail.com',
      password: 'Password123!'
    }

    await User.findOneAndDelete({ username: newUser.username })

    const response = await request(app)
      .post('/user/signup')
      .send(newUser)
      .expect(201)

    expect(response.body.message).toBe('Signup successful')

    const newLogin = {
      email: 'billybob@gmail.com',
      password: 'Password123!'
    }

    const response2 = await request(app)
      .post('/user/login')
      .send(newLogin)
      .expect(200)

    expect(response2.body.message).toBe('Login successful')

    // const clientId = new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaaa");
    const client = { recepientName: 'Name' }

    // const businessId = new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaab");
    const business = { busName: 'Name' }

    const newInvoice = {
      invoiceNo: 'Test Invoice',
      date: '2025-03-13T00:00:00.000Z',
      productDetail: 'DELL Monitor',
      productFee: 250,
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
      .expect(400)

    expect(response3.body.error).toBe('Invoice has missing fields')
  })

  // it('should return an error if the token is invalid', async () => {
  //   const newUser = {
  //     username: 'Billy Bob',
  //     email: 'billybob@gmail.com',
  //     password: 'Password123!'
  //   };
  //
  //   await User.findOneAndDelete({ username: newUser.username });
  //
  //   const response = await request(app)
  //     .post('/user/signup')
  //     .send(newUser)
  //     .expect(201);
  //
  //   expect(response.body.message).toBe('Signup successful');
  //
  //   const newLogin = {
  //     email: 'billybob@gmail.com',
  //     password: 'Password123!'
  //   };
  //
  //   const response2 = await request(app)
  //     .post('/user/login')
  //     .send(newLogin)
  //     .expect(200);
  //
  //   expect(response2.body.message).toBe('Login successful');
  //
  //   await User.findOneAndDelete({ username: newUser.username });
  //
  //   const newInvoice = {
  //     invoiceNo: 'Test Invoice',
  //     date: '2025-03-13T00:00:00.000Z',
  //     productDetail: 'DELL Monitor',
  //     productFee: 250,
  //     productGst: 25,
  //     productTotal: 275
  //   };
  //
  //   const response3 = await request(app)
  //     .post('/invoices')
  //     .send(newInvoice)
  //     .expect(400);
  //
  //   expect(response3.body.error).toBe('Token is invalid');
  // });
})

// const request = require('supertest')
// const { app, server } = require('../../main/server')
// const User = require('../../main/models/UsersModel')
// const Business = require('../../main/models/BusinessModel')
// const Client = require('../../main/models/ClientModel')
// const Invoice = require('../../main/models/InvoiceModel')
// const mongoose = require('mongoose') // Import mongoose for DB teardown

// describe('POST /invoices', () => {
//   afterAll(async () => {
//     await mongoose.connection.close() // Ensure DB connection is closed
//     // server.close()
//   })

//   it('should create a new invoice and return successfully', async () => {
//     const newUser = {
//       username: 'Billy',
//       email: 'billy@gmail.com',
//       password: 'Password123!'
//     }

//     await User.findOneAndDelete({"username" : newUser.username});

//     const response = await request(app)
//       .post('/user/signup')
//       .send(newUser)
//       .expect(200)

//     expect(response.body.message).toBe('Signup successful')

//     const newLogin = {
//       email: 'billy@gmail.com',
//       password: 'Password123!'
//     }

//     const response2 = await request(app)
//       .post('/user/login')
//       .send(newLogin)
//       .expect(200)

//     expect(response2.body.message).toBe('Login successful')

//     // const clientId = new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaaa");
//     const client = {
//       recepientName: 'Name'
//     }

//     // const businessId = new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaab");
//     const business = {
//       busName: 'Bruh'
//     }

//     const newInvoice = {
//       invoiceNo: 'Testing',
//       date: '2025-03-13T00:00:00.000Z',
//       productDetail: 'DELL Monitor',
//       productFee: 250,
//       productGst: 25,
//       productTotal: 275,
//       business: business,
//       client: client
//     }

//     await Invoice.findOneAndDelete({ "invoiceNo" : newInvoice.invoiceNo });
//     await Business.findOneAndDelete({ "busName" : business.busName });
//     await Client.findOneAndDelete({ "recepientName" : client.recepientName});

//     const response3 = await request(app)
//       .post('/invoice/create')
//       .send(newInvoice)
//       .expect(200)

//     expect(response3.body.message).toBe('Invoice created')
//   })

//   it('should return an error when the product fees are not numbers', async () => {
//     const newUser = {
//       username: 'Bill',
//       email: 'billybob@gmail.com',
//       password: 'Password123!'
//     }

//     await User.findOneAndDelete({"username" : newUser.username});

//     const response = await request(app)
//       .post('/user/signup')
//       .send(newUser)
//       .expect(200)

//     expect(response.body.message).toBe('Signup successful')

//     const newLogin = {
//       email: 'billybob@gmail.com',
//       password: 'Password123!'
//     }

//     const response2 = await request(app)
//       .post('/user/login')
//       .send(newLogin)
//       .expect(200)

//     expect(response2.body.message).toBe('Login successful')

//     const client = {
//       recepientName: 'Name'
//     }

//     // const businessId = new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaab");
//     const business = {
//       busName: 'Bruh'
//     }

//     const newInvoice = {
//       invoiceNo: 'Test Invoice',
//       date: '2025-03-13T00:00:00.000Z',
//       productDetail: 'DELL Monitor',
//       productFee: 'notanumber',
//       productGst: 'stillnotanumber',
//       productTotal: 'pretendnumber',
//       business: business,
//       client: client
//     }

//     await Invoice.findOneAndDelete({ "invoiceNo" : newInvoice.invoiceNo });
//     await Business.findOneAndDelete({ "busName" : business.busName });
//     await Client.findOneAndDelete({ "recepientName" : client.recepientName});

//     const response3 = await request(app)
//       .post('/invoice/create')
//       .send(newInvoice)
//       .expect(400)

//     expect(response3.body.error).toBe('Product fees must be numbers');
//   })

//   it('should return an error when not all fields are filled out', async () => {
//     const newUser = {
//       username: 'Bill',
//       email: 'billybob@gmail.com',
//       password: 'Password123!'
//     }

//     await User.findOneAndDelete({"username" : newUser.username});

//     const response = await request(app)
//       .post('/user/signup')
//       .send(newUser)
//       .expect(200)

//     expect(response.body.message).toBe('Signup successful')

//     const newLogin = {
//       email: 'billybob@gmail.com',
//       password: 'Password123!'
//     }

//     const response2 = await request(app)
//       .post('/user/login')
//       .send(newLogin)
//       .expect(200)

//     expect(response2.body.message).toBe('Login successful')

//     // const clientId = new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaaa");
//     const client = {
//       recepientName: 'Name'
//     }

//     // const businessId = new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaab");
//     const business = {
//       busName: 'Name'
//     }

//     const newInvoice = {
//       invoiceNo: 'Test Invoice',
//       date: '2025-03-13T00:00:00.000Z',
//       productDetail: 'DELL Monitor',
//       productFee: 250,
//       productTotal: 275,
//       business: business,
//       client: client
//     }

//     await Invoice.findOneAndDelete({ "invoiceNo" : newInvoice.invoiceNo });
//     await Business.findOneAndDelete({ "busName" : business.busName });
//     await Client.findOneAndDelete({ "recepientName" : client.recepientName});

//     const response3 = await request(app)
//       .post('/invoice/create')
//       .send(newInvoice)
//       .expect(400)

//     expect(response3.body.error).toBe('Invoice has missing fields')

//   })

//   // it('should return an error if the token is invalid', async () => {
//   //   const newUser = {
//   //     username: 'Billy Bob',
//   //     email: 'billybob@gmail.com',
//   //     password: 'Password123!'
//   //   }

//   //   await User.findOneAndDelete({"username" : newUser.username});

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

//   //   await User.findOneAndDelete({"username" : newUser.username});

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
//   //     .expect(400)

//   //   expect(response3.body.error).toBe('Token is invalid')
//   // })
// })
