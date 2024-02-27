import dotenv from 'dotenv';
dotenv.config()
import mongoose from 'mongoose'
import CartDao from './../src/dao/mongo/cart.mongo.js'
import CartsModel from './../src/dao/mongo/models/cart.model.js'
import { expect } from 'chai'
import supertest from 'supertest'

mongoose.connect(process.env.MONGO)

const requester = supertest('http://localhost:8080')

describe('Carts testing', () => {
    let cartsDao;
    describe('DAO Testing', () => {
        before(() => {
            cartsDao = new CartDao(CartsModel)
        })
        it('The dao must be able to create a cart', async () => {
            const result = await cartsDao.createCart()
            expect(result).to.have.property('_id')
        }).timeout(5000)
    })
    describe('Router Testing', () => {
        it('The POST endpoint must create a cart in the database correctly', async () => {
            const res = await requester.post(`/api/carts/`)
            expect(res.statusCode).to.equal(200)
            expect(res._body).to.have.property('payload')
            expect(res._body.payload).to.have.property('createdCart')
            expect(res._body.payload.createdCart).to.have.property('products')
        }).timeout(10000)
        it('The GET endpoint must fetch carts from the database correctly', async () => {
            const res = await requester.get(`/api/carts/`)
            expect(res.statusCode).to.equal(200)
            expect(res._body).to.have.property('payload')
            expect(res._body.payload).to.be.an('array')
        })
        it('The GET by id endpoint must fetch a cart from the database correctly', async () => {
            const cid = '65a9d25107756156100640d6'
            const res = await requester.get(`/api/carts/${cid}`)
            expect(res.statusCode).to.equal(200)
            expect(res._body.payload.products).to.be.an('array')
        })
        it('The PUT endpoint must update the quantity of a product in the cart correctly', async () => {
            const cid = '65a9d25107756156100640d6'
            const pid = '65a9d5db9cd7cc164a2f3b9a'
            const res = await requester.put(`/api/carts/${cid}/products/${pid}`).send({quantity: 25})
            expect(res.statusCode).to.equal(200)
        })
    })
})