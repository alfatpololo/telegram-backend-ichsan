//deklare express
const express = require("express");
const {
	list,
	detail,
	register,
	login,
	update,
	updateImage,
	destroy,
} = require("../controller/user.controller");
const uploadFile = require("../middleware/uploadUser");

const userRouter = express.Router();

userRouter
	.get("/user", list)
	.get("/user/:id", detail)
	.put("/user/:id", update)
	.put("/user/image/:id", uploadFile, updateImage)
	.delete("/user/:id", destroy)

	// register
	.post("/register", register)
	// login
	.post("/login", login);

module.exports = userRouter;
