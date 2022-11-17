const router = require("express").Router();
const auth = require("../controller/auth");
const post = require("../controller/post");
const author = require("../controller/author");
const authorization = require("../middleware/authorization");
router.use("/post", authorization, post);
router.use("/auth", auth);
router.use("/authors", author);
module.exports = router;
