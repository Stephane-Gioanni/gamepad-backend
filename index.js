require("dotenv").config();

const cors = require("cors");
const express = require("express");
const formidable = require("express-formidable");
const dotenv = require("dotenv");

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);

const app = express();
app.use(cors());
app.use(formidable());

const userRoutes = require("./routes/user-routes");
app.use(userRoutes);

app.get("/", (req, res) => {
  try {
    res.json("hello");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log("server has started");
});
