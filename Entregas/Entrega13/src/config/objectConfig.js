import { MongoSingleton } from './mongo.singleton.js'


const mongoInstance = async () => {
    try{
        await MongoSingleton.getInstance()
    }catch(err){
        logger.error(err);
    }
}

export { mongoInstance }