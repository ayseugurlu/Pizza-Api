'use strict'

const router = require('express').Router()

const {list, create, read, update, deleteTopping} = require('../controllers/topping')

router.route('/')
    .get(list)
    .post(create)

router.route('/:id')
    .get(read)
    .put(update)
    .patch(update)
    .delete(deleteTopping)

module.exports = router
