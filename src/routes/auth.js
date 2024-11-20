'use strict'

const router = require('express').Router()

const {login, logout, refresh} = require('../controllers/auth')


router.post('/login',login)
router.post('/refresh',refresh)
router.post('/logout',logout)

module.exports = router