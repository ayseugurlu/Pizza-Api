'use strict' 

const User = require('../models/user')
const Token = require('../models/token')
const passwordEncrypt = require('../helpers/passwordEncrypt')

module.exports = {
    login: async (req,res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password for get simpleToken and JWT'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "aA?123456",
                }
            }
        */

        const {email, userName, password} = req.body

        if(!((userName || email) && password)){
            res.errorStatusCode = 401 
            throw new Error("UserName/Email and Password required!")
        }

        const user = await User.findOne({ $or: [{userName}, {email}]})

        if(user?.password !== passwordEncrypt(password)){
            res.errorStatusCode = 401;
            throw new Error("Incorrect username/email or password.");
        }

        if(!user.isActive){
            res.errorStatusCode = 401;
            throw new Error("This account is not active.")
        }

        let tokenData = await Token.findOne({userId: user._id})

        if(!tokenData){{
            tokenData = await Token.create({
                userId: user._id,
                token: passwordEncrypt(user._id + Date.now())
            })
        }}

        res.send({
            error:false,
            token: tokenData.token,
            user,
        })
    },
    logout: async(req,res) => {
         /*
            #swagger.tags = ["Tokens"]
            #swagger.summary = "Create Token"
        */ 

        const auth = req.headers?.authorization ; // Token ...tokenkey...
        const tokenKey = auth ? auth.split(" ") : null // ["Token", "tokenKey"]
        const result = await Token.deleteOne({token: tokenKey[1]})

        res.send({
            error: false,
            message: "Logged out successfully",
            result
        })


    }
}