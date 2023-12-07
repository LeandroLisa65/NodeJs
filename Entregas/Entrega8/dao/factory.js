import configurationEnv from '../config/config.js';

import { productManager as mongoProductManager } from './mongo/ProductManager.js';
import { userManager as mongoUserManager } from './mongo/UserManager.js';
import { cartManager as mongoCartManager } from './mongo/CartManager.js';

import { productManager as fileProductManager } from './filesystem/ProductManager.js';
import { cartManager as fileCartManager } from './filesystem/CartManager.js';

const UserDaoMongo = mongoUserManager;
const ProductDaoMongo = mongoProductManager;
const CartDaoMongo = mongoCartManager;

const ProductDaoFilesystem = fileProductManager;
const CartDaoFilesystem = fileCartManager;

let UserDao, CartDao, ProductDao;

switch(process.env.PERSISTENCE)
{
    case 'MONGO':

        UserDao = mongoUserManager;
        ProductDao = mongoProductManager;
        CartDao = mongoCartManager;
        
            break;
    case 'FILE':

        ProductDao = fileProductManager;
        CartDao = fileCartManager;
        
            break;
        default:
            break;
}

export { CartDao, ProductDao, UserDao } 