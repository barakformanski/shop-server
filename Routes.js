const Express = require('express');
const Routes = Express.Router();
// const ProductRoute = require(C:\fullstack\projects\shop forever\ProductController\Product.Route.js);
const ProductRoute = require('./ProductController/Product.Route.js');
//const { Router } = require('express');

Routes.use('/products', ProductRoute);
module.exports = Routes;