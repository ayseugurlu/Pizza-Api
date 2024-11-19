'use strict'

const express = require('express')
const app = express()


/*-----------------------------------------*/

//& Required Modules:

//* env variables
require('dotenv').config()
const PORT = process.env?.PORT || 8000

//* asyncErrors to errorHandler:
require('express-async-errors')

/*-----------------------------------------------------------*/

//& Configuration:
//* Connect to DB 
const { dbConnection } = require('./src/configs/dbConnection')
dbConnection()

/*------------------------------------------------------------*/

//& Middlewares:
//*Accept JSON:
app.use(express.json())

//* Logger
app.use(require('./src/middlewares/logger'))

//* Authentication



//* findSearchSortPage / res.getModelList
app.use(require('./src/middlewares/queryHandler'))



/*---------------------------------------------------------*/

//& Routes

//* HomePath
app.all('/', (req,res) => {
    res.send({
        error:false,
        message: 'Welcome to PIZZA API',
        docs:{
            swagger:"/documents/swagger",
            redoc: "documents/redoc",
            json: "/documents/json",
        },
        user: req.user,
    })
})

//users
app.use('/users', require('./src/routes/user'))

//auth
app.use('/auth', require('./src/routes/auth'))

//token
app.use('/tokens', require('./src/routes/token'))

//toppings
app.use('/toppings', require('./src/routes/topping'))




/*------------------------------------------------------*/

//& errorHandler:
app.use(require('./src/middlewares/errorHandler'))

//^ RUN SERVER:

app.listen(PORT, () => console.log('http://127.0.0.1' + PORT))

/*----------------------------------------------------------*/




//! Syncronization (must be in commentLine):
// require('./src/helpers/sync')() // !!! It clear database.





