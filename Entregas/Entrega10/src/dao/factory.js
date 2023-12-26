import { mongoInstance } from './../config/objectConfig.js'
import UserDaoMongo from './mongo/user.mongo.js'
import ProductDaoMongo from './mongo/product.mongo.js'
import CartDaoMongo from './mongo/cart.mongo.js'
import TicketDaoMongo from './mongo/ticket.mongo.js'
import UserDaoFile from './filesystem/user.file.js'
import ProductDaoFile from './filesystem/product.file.js'
import CartDaoFile from './filesystem/cart.file.js'

let UserDao, ProductDao, CartDao, TicketDao

switch(process.env.PERSISTENCE){
    case 'MONGO':
        mongoInstance()
        UserDao = UserDaoMongo
        ProductDao = ProductDaoMongo
        CartDao = CartDaoMongo
        TicketDao = TicketDaoMongo
    break; 
    case 'FILE':
        UserDao = UserDaoFile
        ProductDao = ProductDaoFile
        CartDao = CartDaoFile
    break;
}

export { UserDao, ProductDao, CartDao, TicketDao }