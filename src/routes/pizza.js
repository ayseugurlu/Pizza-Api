'use strict'

const router = require('express').Router()

const {list, create, read, update, deletePizza} = require('../controllers/pizza')
const upload = require('../middlewares/upload')

router.route('/')
    .get(list)
    .post(upload.single('image'), create)

router.route('/:id')
    .get(read)
    .put(upload.single('image'), update)
    .patch(upload.single('image'), update)
    .delete(deletePizza)

module.exports = router
