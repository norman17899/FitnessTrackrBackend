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

// app.use((req, res, next) => {
//     console.log("<____Body Logger START____>");
//     console.log(req.body);
//     console.log("<_____Body Logger END_____>");
  
//     next();
//   });
  
app.use((req, res) => {
    res.status(404).send({ message: "Not found!" });
  });

module.exports = app;
