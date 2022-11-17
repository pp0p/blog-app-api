const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/user");

// get one user
router.get("/:id", async (req, res) => {
  try {
    const author = await User.findById(req.params.id).select(
      "-_id -password -email"
    );
    const authorPost = await Post.find({ author: req.params.id });

      if (!(author)) {
        return res.status(404).send({message:"author not found"})
      }

    res.send({ author, authorPost });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-date -email -password -__v");
    res.send(users);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
