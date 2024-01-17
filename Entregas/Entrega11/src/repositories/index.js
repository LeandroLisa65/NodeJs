import { UserDao, ProductDao, CartDao, TicketDao } from '../dao/factory.js'
import UserRepository from './user.repository.js'
import ProductRepository from './product.repository.js'
import CartRepository from './cart.repository.js'
import TicketRepository from './ticket.repository.js'

const userService = new UserRepository(new UserDao)
const productService = new ProductRepository(new ProductDao)
const cartService = new CartRepository(new CartDao)
const ticketService = new TicketRepository(new TicketDao)

export { userService, cartService, productService, ticketService }