const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const upload = require("../services/upload_image");
const jwt = require("jsonwebtoken");
const validateEmail = require("../services/emailValidate");
// sign in
router.post("/signin", async (req, res) => {
  try {
    console.log("sss");
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ message: "Please add all fields" });
    }
    const emailValidate = validateEmail(email);
    if (!emailValidate) {
      return res.status(400).send({ message: "Invalid Email" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "email does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "invalid Password ! " });
    }
    await user.save();
    // get the server url to save image url in jwt token for user
    const url = req.protocol + "://" + req.get("host") + "/images";

    // create token
    const token = jwt.sign(
      {
        name: user.fullName,
        email: user.email,
        photo: user.photo ? url + `/${user.photo}` : "",
        _id: user._id,
      },
      process.env.jwtSecret
    );
    res.status(200).send({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// create new a account
router.post("/signup", (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(413).send({ message: err.message });
      }
      console.log(req.body);
      
      const { email, password, fullName } = req.body;
      if (!(email && password && fullName)) {
        return res.status(422).send({ message: "Please add all fields" });
      }
      const emailValidate = validateEmail(email);
      if (!emailValidate) {
        return res.status(400).send({ message: "Invalid Email" });
      }
      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        return res.status(401).send({ message: "email already exist" });
      }

      // Create New User
      const hashPassword = await bcrypt.hash(password, 10);
      const url = req.protocol + "://" + req.get("host") + "/images";
      const image = req.file ? url + `/${req.file.filename}` : "";
      const user = new User({
        email,
        fullName,
        password: hashPassword,
        photo: image,
      });
      console.log(user);
      await user.save();
      // get the server url to save image url in jwt token for user
      const token = user.genAuthToken();
      return res.status(201).send({ message: "Done Register", token: token });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
