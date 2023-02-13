require("dotenv").config()
const express = require("express")
const app = express()

// Setup your Middleware and API Router here
const morgan = require('morgan');
app.use(morgan('dev'));

const cors = require('cors')
app.use(cors());

app.use(express.json());

const router = require("./api");
app.use("/api", router)

app.use((req, res) => {
    res.status(404).send({ message: "Page not found!" });
  });

module.exports = app;
