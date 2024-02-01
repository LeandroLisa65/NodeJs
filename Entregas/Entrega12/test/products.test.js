import dotenv from 'dotenv';
dotenv.config()
import mongoose from 'mongoose'
import ProductManagerMongo from './../src/dao/mongo/product.mongo.js'
import productModel from '../src/dao/mongo/models/product.model.js';
import { expect } from 'chai'
import supertest from 'supertest'

mongoose.connect(process.env.MONGO)

const requester = supertest('http://localhost:8080')

describe('Products testing', () => {
    let productsDao;
    describe('DAO Testing', () => {
        before(() => {
            productsDao = new ProductManagerMongo(productModel)
        })
        it('The dao must be able to obtain the products from the database', async () => {
            const result = await productsDao.getProducts()
            expect(result).to.have.property('docs').that.is.an('array')
        }).timeout(5000)
        it('The dao must be able to add a product to the database and delete it', async () => {
            // I am deleting the product because when I run the test again the code will be repeated and this will return an error.
                const product = {
                    title: 'Test product',
                    description: 'This is a product created by a test file',
                    thumbnails: [],
                    category: 'testing',
                    price: 0,
                    stock: 0,
                    status: false,
                    code: 'TEST123',
                    owner: 'admin'
                }
                const result = await productsDao.addProduct(product)
                expect(result).to.be.an('object')
                expect(result).to.have.property('_id')
        
                const resultDelete = await productsDao.deleteProduct(result._id)
                expect(resultDelete).to.be.an('object')
                expect(resultDelete).to.have.property('deletedCount')
            })
        it('The dao must be able to add a product to the database, update it and then delete it', async () => {
            const product = {
                title: 'Test product',
                description: 'This is a product created by a test file',
                thumbnails: [],
                category: 'testing',
                price: 0,
                stock: 0,
                status: false,
                code: 'TEST123',
                owner: 'admin'
            }
            const result = await productsDao.addProduct(product)
            expect(result).to.be.an('object')
            expect(result).to.have.property('_id')
    
            const resultUpdate = await productsDao.updateProduct(result._id, {title: 'Update TEST'})
            expect(resultUpdate).to.be.an('object')
            expect(resultUpdate).to.have.property('acknowledged', true)
    
            const resultDelete = await productsDao.deleteProduct(result._id)
            expect(resultDelete).to.be.an('object')
            expect(resultDelete).to.have.property('deletedCount')
        })
    })
    describe('Router testing', async () => {
        it('The GET endpoint must fetch products from the database correctly', async () => {
            const res = await requester.get(`/api/products/`)
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.have.property('payload')
            expect(res.body.payload.products).to.be.an('array')
        })
        it('The GET by id endpoint must fetch a product from the database correctly', async () => {
            const pid = '65a9d5db9cd7cc164a2f3b9a'
            const res = await requester.get(`/api/products/${pid}`)
            expect(res.statusCode).to.equal(200)
            expect(res.body.payload.product).to.have.property('_id')
            expect(res.body.payload.product._id).to.equal(pid)
        })
    })
})
