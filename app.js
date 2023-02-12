require("dotenv").config()
const express = require("express")
const app = express()

// Setup your Middleware and API Router here
const morgan = require('morgan');
app.use(morgan('dev'));

app.use(express.json());

const router = require("./api");
app.use("/api", router)

app.use((req, res, next) => {
    next();
})

module.exports = app;
