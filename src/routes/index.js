'use strict'

const router = require('express').Router()

//ROUTER INDEX

// URL:

//auth
router.use('/auth', require('./auth'))

//users
router.use('/users', require('./user'))

//token
router.use('/tokens', require('./token'))

//toppings
router.use('/toppings', require('./topping'))

//pizzas
router.use('/pizzas', require('./pizza'))

//orders
router.use('/orders', require('./order'))

module.exports = router