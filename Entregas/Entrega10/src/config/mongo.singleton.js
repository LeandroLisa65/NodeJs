import mongoose from 'mongoose'
import { logger } from './logger.js'

class MongoSingleton {
    static #instance

    constructor(){
        this.#connectMongoDB()
    }

    static getInstance(){
        if(this.#instance){
            logger.info('There is already a connection with MongoDB');
        }else{
            this.#instance = new MongoSingleton()
        }
        return this.#instance
    }

    #connectMongoDB = async () => {
        try{
            await mongoose.connect(process.env.MONGO)
            logger.info('Successfully connected to MongoDB')
        }catch(err){
            logger.error('Could not connect to MongoDB: ' + err)
            process.exit()
        }
    }
}

export { MongoSingleton }
