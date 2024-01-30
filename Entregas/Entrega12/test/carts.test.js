import dotenv from 'dotenv';
dotenv.config()
import mongoose from 'mongoose'
import CartDao from './../src/dao/mongo/cart.mongo.js'
import CartsModel from './../src/dao/mongo/models/cart.model.js'
import { expect } from 'chai'

import supertest from 'supertest'
const requester = supertest('http://localhost:8080')

mongoose.connect(process.env.MONGO)
let cartsDao;
describe('Carts testing', () => {
    describe('DAO Testing', () => {
        before(() => {
            cartsDao = new CartDao(CartsModel)
        })
        it('The dao must be able to create a cart', async () => {
            const result = await cartsDao.createCart()
            expect(result).to.have.property('_id')
        }).timeout(5000)
    })
})