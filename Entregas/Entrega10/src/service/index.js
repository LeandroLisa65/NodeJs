import { UserDao, ProductDao, CartDao, TicketDao } from '../dao/factory.js'
import UserRepository from '../repositories/user.repository.js'
import ProductRepository from '../repositories/product.repository.js'
import CartRepository from '../repositories/cart.repository.js'
import TicketRepository from '../repositories/ticket.repository.js'

const userService = new UserRepository(new UserDao)
const productService = new ProductRepository(new ProductDao)
const cartService = new CartRepository(new CartDao)
const ticketService = new TicketRepository(new TicketDao)

export { userService, cartService, productService, ticketService }