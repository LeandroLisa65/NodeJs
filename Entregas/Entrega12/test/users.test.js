import dotenv from 'dotenv';
dotenv.config()
import mongoose from 'mongoose'
import UserDao from './../src/dao/mongo/user.mongo.js'
import UserModel from './../src/dao/mongo/models/user.model.js'
import { expect } from 'chai'

import supertest from 'supertest'
const requester = supertest('http://localhost:8080')

mongoose.connect(process.env.MONGO)
let usersDao = new UserDao(UserModel)

describe('Users testing', () => {
    describe('DAO Testing', () => {
        before(() => {
            usersDao = new UserDao(UserModel)
        })
        it('The dao must be able to obtain a user by id from the database', async () => {
            const result = await usersDao.getUserByEmail('email@email.com')
            expect(result).to.have.property('_id')
            expect(result).to.have.property('email')
        }).timeout(5000)
        it('The dao must be able to add a user to the database and delete it', async () => {
            const objectId = new mongoose.Types.ObjectId('649c563f2e3e50755408566a')
            const user = {
                first_name: 'Test user',
                last_name: 'This is a user created by a test file',
                age: 25,
                email: 'test@email.com',
                password: 'test',
                cart: objectId,
                role: 'user'
            }

            const result = await usersDao.addUser(user)
            expect(result).to.be.an('object')
            expect(result).to.have.property('_id')
            
            const resultDelete = await usersDao.deleteUser(result._id)
            expect(resultDelete).to.be.an('object')
            expect(resultDelete).to.have.property('_id')
        })
    })
})