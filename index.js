const express = require("express");
const cors = require("cors");
const morgan = require("morgan")
const routes = require('./src/router')
const app = express();
require('dotenv').config({path:'./env'})

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));
app.use(morgan("dev"))

const db = require("./src/db");
db.sequelize.sync({
    alter: true
  })
  .then(() => {

    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });



app.get("/", (req, res) => {
  res.json({
    message: "server is running"
  });
});
app.use("/", routes)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});