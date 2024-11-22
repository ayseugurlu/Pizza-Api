"use strict";

const express = require("express");
const app = express();

/*-----------------------------------------*/

//& Required Modules:

//* env variables
require("dotenv").config();
const PORT = process.env?.PORT || 8000;

//* asyncErrors to errorHandler:
require("express-async-errors");

/*-----------------------------------------------------------*/

//& Configuration:
//* Connect to DB
const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

/*------------------------------------------------------------*/

//& Cross-origin resource sharing (CORS): $ npm i cors
const cors = require('cors')
const defaultCorsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
}
app.use(cors())

/*------------------------------------------------------------*/

//& Middlewares:
//*Accept JSON:
app.use(express.json());

//* Logger
app.use(require("./src/middlewares/logger"));

//* Auhentication: (JWT & Simple Token)
app.use(require("./src/middlewares/authentication"));

//* findSearchSortPage / res.getModelList
app.use(require("./src/middlewares/queryHandler"));

/*---------------------------------------------------------*/

//& Routes

//* All Routes
app.use("/", require("./src/routes"));

//* HomePath
app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to PIZZA API",
    docs: {
      swagger: "/documents/swagger",
      redoc: "documents/redoc",
      json: "/documents/json",
    },
    user: req.user,
  });
});

//* StaticFile:
app.use('/images', express.static('./uploads'))

/*------------------------------------------------------*/

//& errorHandler:
app.use(require("./src/middlewares/errorHandler"));

//^ RUN SERVER:

app.listen(PORT, () => console.log("http://127.0.0.1" + PORT));

/*----------------------------------------------------------*/

//! Syncronization (must be in commentLine):
// require('./src/helpers/sync')() // !!! It clear database.
