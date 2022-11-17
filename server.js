const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const db = require("./config/db");
const api = require("./router/router");
const PORT = process.env.PORT;

// connect to database
db();
// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/images", express.static("images"));

app.use("/api", api);
app.use("*", (req, res) => {
  res.status(404).send({
    message: "Not Found",
  });
});
app.listen(PORT, () => console.log(`App run on Port ${PORT}`));
