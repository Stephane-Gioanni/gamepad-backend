const express = require("express");
const router = express.Router();

const User = require("../models/user-model");
const uid2 = require("uid2");
const { SHA256 } = require("crypto-js");
const encBase64 = require("crypto-js/enc-base64");

router.post("/signup", async (req, res) => {
  console.log(req.fields);
  try {
    let userEmailCheck = await User.findOne({ email: req.fields.email });

    if (userEmailCheck) {
      res.status(400).json({ message: "Already an account with this email" });
    } else {
      const token = uid2(16);
      const salt = uid2(16);
      const hash = SHA256(req.fields.password + salt).toString(encBase64);

      const newUser = new User({
        email: req.fields.email,
        token: token,
        salt: salt,
        hash: hash,
      });

      newUser.save();

      res.json(newUser);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  console.log(req.fields);
  try {
    const userMailCheck = await User.findOne({ email: req.fields.email });

    if (userMailCheck) {
      console.log(userMailCheck);

      let passwordCheck = SHA256(
        req.fields.password + userMailCheck.salt
      ).toString(encBase64);

      if (passwordCheck === userMailCheck.hash) {
        res.json({
          token: userMailCheck.token,
          favorites: userMailCheck.favorites,
        });
      } else {
        res.status(400).json({ message: "Wrong password" });
      }
    } else {
      res
        .status(400)
        .json({ message: "No account with this email, create an account" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user-collection", async (req, res) => {
  console.log(req.fields);
  try {
    const userLogChecked = await User.findOne({ token: req.fields.token });
    console.log(userLogChecked);
    if (userLogChecked) {
      userLogChecked.favorites = req.fields.favorites;
      userLogChecked.save();
      res.json({
        token: userLogChecked.token,
        collection: userLogChecked.favorites,
      });
    } else {
      res.status(400).json({ message: "You must connect" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
