'use strict'

const Token = require('../models/token')
const jwt = require('jsonwebtoken')

module.exports = async (req,res,next) => {

    req.user = null //req.user undefined yerine null olsun diye yazariz bos geldiginde

    const auth = req.headers?.authorization //Token ...tokenKey || Bearer ...accessToken...
    const tokenKey = auth ? auth.split(" ") : null //['Token', '....tokenKey...'] || ['Bearer', '....accessToken...']

    //*burda hem simpletoken hem jwt yazdik ama normalde sadece biri tek bir if ile kullanilir

    if(tokenKey) {
        if(tokenKey[0] == 'Token'){
            //simpleToken
            const tokenData = await Token.findOne({token: tokenKey[1]}).populate('userId')
            req.user = tokenData ? tokenData.userId : false

        }
    }else if( tokenKey[0] == 'Bearer'){
        //JWT
        jwt.verify(tokenKey[1], process.env.ACCESS_KEY, (err, accessData) => {
            req.user = accessData ? accessData: null
        })


    }


    next()

}