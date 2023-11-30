import { CartDao, ProductDao, UserDao } from '../dao/factory.js'

import UserRepository from './repositories/user.repository.js';
import ProductRepository from './repositories/product.repository.js';
import CartRepository from './repositories/cart.repository.js';

const userService = new UserRepository(UserDao)
const productService = new ProductRepository(ProductDao)
const cartService = new CartRepository(CartDao)

export { userService, productService, cartService }