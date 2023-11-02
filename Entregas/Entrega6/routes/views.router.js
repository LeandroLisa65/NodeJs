import { Router } from "express";
import { productManager } from "../dao/Dao/MongoDb/ProductManager.js";
import { cartManager } from "../dao/Dao/MongoDb/CartManager.js";

const router = Router();


router.get("/", async (req, res) => {
  const options = {
    limit: 10,
    page: 1,
    sort: { price: 1 }
  }
  const products = JSON.parse(JSON.stringify((await productManager.getProducts({},options))));
  res.render("home", { products: products });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

router.get('/products', async (req, res) => {
  let queryPage = ''
  if (req.query.page) {
      queryPage = parseInt(req.query.page);
      if (isNaN(queryPage) || queryPage < 1) {
          throw new Error('Invalid page number');
      }
  }

  let query = {};

  if(req.query.query === undefined)
  { // query undefined
      query = {}
  }
  else if(req.query.query === 'true')
  { // status === true
      query.status = true
  }else if(req.query.query === 'false')
  { // status === false
      query.status = false
  }else
  { // category === req.query.params
      query.category = req.query.query
  }

  let sort = null;

  if (req.query.sort === "asc") 
  { // asc or desc
      sort = { price: 1 };
  } else if (req.query.sort === "desc") {
      sort = { price: -1 };
  }

  const options = {
      limit: req.query.limit ? parseInt(req.query.limit) : 10,
      page: req.query.page ? parseInt(req.query.page) : 1,
      sort: sort
  }
  
  let prevLink = ''
  let nextLink = ''

  const products = JSON.parse(JSON.stringify(await productManager.getProducts(query, options)));
  const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = products

  if(query.status !== undefined){ // if query.status exists
      hasPrevPage === false ? prevLink = null : prevLink = `/api/views/products?page=${parseInt(prevPage)}&limit=${options.limit}&sort=${req.query.sort}&query=${query.status}`
      hasNextPage === false ? nextLink = null : nextLink = `/api/views/products?page=${parseInt(nextPage)}&limit=${options.limit}&sort=${req.query.sort}&query=${query.status}`
  }else if(query.category !== undefined){ // if query.category exists
      hasPrevPage === false ? prevLink = null : prevLink = `/api/views/products/${query.category}?page=${parseInt(prevPage)}&limit=${options.limit}&sort=${req.query.sort}`
      hasNextPage === false ? nextLink = null : nextLink = `/api/views/products/${query.category}?page=${parseInt(nextPage)}&limit=${options.limit}&sort=${req.query.sort}`
  }else{ // if there isn't query values
      hasPrevPage === false ? prevLink = null : prevLink = `/api/views/products?page=${parseInt(prevPage)}&limit=${options.limit}&sort=${req.query.sort}`
      hasNextPage === false ? nextLink = null : nextLink = `/api/views/products?page=${parseInt(nextPage)}&limit=${options.limit}&sort=${req.query.sort}`
  }
  res.render('products', { payload: docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink });
})

router.get('/cart/:cid', async (req, res) => {
  const response = JSON.parse(JSON.stringify(await cartManager.getCartById(req.params.cid)));
  console.log(response);
  res.render('cart', {payload: response})
})

router.get('/login', (req, res) => {
  res.render('login');
})

router.get('/signup', (req, res) => {
  res.render('signup');
})

router.get('/profile', (req, res) => {
  res.render('profile');
})

export default router;
