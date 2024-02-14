import dotenv from 'dotenv';
dotenv.config()
import mongoose from 'mongoose'
import UserDao from './../src/dao/mongo/user.mongo.js'
import UserModel from './../src/dao/mongo/models/user.model.js'
import { expect } from 'chai'
import supertest from 'supertest'

mongoose.connect(process.env.MONGO)

const requester = supertest('http://localhost:8080')

const getCookie = (res) => {
    let cookie = {
        name: res.headers['set-cookie'][0].split('=')[0],
        value: res.headers['set-cookie'][0].split('=')[1].split(';')[0]
    }

    return cookie;
}

describe('Users testing', () => {
    let usersDao
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
        it('The dao should retrieve the list of users', async () => {
            const result = await usersDao.getUsers()
            expect(result).that.is.an('array')
        })
    })
    describe('Router testing', async() => {
        it('The POST register endpoint must create a user in the database correctly', async () => {
            const objectId = new mongoose.Types.ObjectId('649c563f2e3e50755408566a')
            const uniqueEmail = `test${Date.now()}@email.com`; 
            const user = {
                first_name: 'Test user',
                last_name: 'This is a user created by a test file',
                date_of_birth: '2023-08-21',
                email: uniqueEmail,
                password: 'test',
                cart: objectId,
                role: 'user',
            };
            
            const res = await requester.post(`/api/users/register`).send(user)

            expect(res.statusCode).to.equal(200)
            expect(res._body).to.have.property('payload')
        }).timeout(10000)
        it('The POST login endpoint must log in with a user account correctly and then logout', async () => {
            const login =   {
                email: "email@email.com",
                password: "password"
            }
            
            const res = await requester.post(`/api/users/login`).send(login)
            expect(res.statusCode).to.equal(200)
            expect(res._body.payload).to.have.property('access_token')
            
            const resLogout = await requester.get('/api/users/logout')
            expect(resLogout.statusCode).to.equal(200)
        }).timeout(5000)
        it('The POST login endpoint must log in with a user account correctly and then logout', async () => {
            const login =   {
                email: "email@email.com",
                password: "password"
            }
            
            const res = await requester.post(`/api/users/login`).send(login)
            expect(res.statusCode).to.equal(200)
            expect(res._body.payload).to.have.property('access_token')
            
            let cookie = getCookie(res)

            const response = await requester.get('/api/users/current').set('Cookie',[`${cookie.name}=${cookie.value}`])
            expect(response.statusCode).to.equal(200)
        }).timeout(5000)
    })
})