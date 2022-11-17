const mongoose = require("mongoose");

// create your database url to .env file
const db_url = process.env.DB_URL;

module.exports = async () => {
  await mongoose
    .connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Successfully connected to database  ..."))
    .catch((err) => {
      if (err) {
        console.log("database connection failed ");
        console.log(err);
      }
    });
};
