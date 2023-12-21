import { CartDao, ProductDao, UserDao, TicketDao } from '../dao/factory.js'

import UserRepository from './repositories/user.repository.js';
import ProductRepository from './repositories/product.repository.js';
import CartRepository from './repositories/cart.repository.js';
import TicketRepository from './repositories/ticket.repository.js';

const userService = new UserRepository(UserDao)
const productService = new ProductRepository(ProductDao)
const cartService = new CartRepository(CartDao)
const ticketService = new TicketRepository(TicketDao)

export { userService, productService, cartService, ticketService }