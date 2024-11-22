'use strict'

const router = require('express').Router()

const {list, create, read, update, deletePizza} = require('../controllers/pizza')

router.route('/')
    .get(list)
    .post(create)

router.route('/:id')
    .get(read)
    .put(update)
    .patch(update)
    .delete(deletePizza)

module.exports = router
