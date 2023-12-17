import configurationEnv from '../config/config.js';

import { productManager as mongoProductManager } from './mongo/ProductManager.js';
import { userManager as mongoUserManager } from './mongo/UserManager.js';
import { cartManager as mongoCartManager } from './mongo/CartManager.js';
import { ticketManager as mongoTicketManager } from './mongo/TicketManager.js';
 
import { productManager as fileProductManager } from './filesystem/ProductManager.js';
import { cartManager as fileCartManager } from './filesystem/CartManager.js';

let UserDao, CartDao, ProductDao, TicketDao;

switch(process.env.PERSISTENCE)
{
    case 'MONGO':

        UserDao = mongoUserManager;
        ProductDao = mongoProductManager;
        CartDao = mongoCartManager;
        TicketDao = mongoTicketManager;
        
            break;
    case 'FILE':

        ProductDao = fileProductManager;
        CartDao = fileCartManager;
        
            break;
        default:
            break;
}

export { CartDao, ProductDao, UserDao, TicketDao } 