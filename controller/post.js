const router = require("express").Router();
const Post = require("../models/post");
const upload = require("../services/upload_image");

// get single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.find({ _id: req.params.id }).populate(
      "author",
      "-password -email -date"
    );
    console.log(post);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    } else {
      return res.status(200).send(post);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// create new post
router.post("/", (req, res) => {
  try {
    upload(req, res, async () => {
      const { title, author, content } = req.body;
      if (!(author && content && title)) {
        return res.status(422).send({ message: "Please add all fields" });
      }
      const url = req.protocol + "://" + req.get("host") + "/images";
      const image = req.file ? url + `/${req.file.filename}` : "";
      console.log(req.file);
      const newPost = new Post({
        author,
        title,
        content,
        imgCover: image,
      });
      await newPost.save();

      res.status(201).send({ newPost });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// update post
router.put("/", async (req, res) => {
  try {
    const { author, postId, title, content } = req.body;

    if (!(title && content && postId && author)) {
      return res.status(422).json({ message: "Please add all fields" });
    }
    const post = await Post.findById(postId);
    if (post.author == author) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          {
            $set: { title, author, content },
          },
          { new: true }
        );
        res.status(200).send({ message: "Done Update ...", post: updatedPost });
      } catch (err) {
        console.log(err);

        return res.status(500).send({ message: "Internal Server Error" });
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (post) {
      return res.send({ message: "Done Deleted Successfully" });
    }
    return res.send({ message: "Post Not found" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// write a comment
router.post("/comment/:id", async (req, res) => {
  try {
    const { user, comment } = req.body;
    if (!(user && comment)) {
      return res.status(422).json({ message: "Please add all fields" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ message: "Post Not Found" });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: { Comments: { user, comment } },
      },
      { new: true }
    );
    res.status(200).send({ Comments: updatedPost.Comments });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
module.exports = router;
