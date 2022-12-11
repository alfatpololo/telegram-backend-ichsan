const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const socket = require("socket.io");
const socketController = require("./src/socket/index");
const userRouter = require("./src/router/user.routes");

const http = require("http");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(userRouter);
// app.get("/ping", (req, res) => {
// 	res.json({
// 		message: "PONG",
// 	});
// });

const server = http.createServer(app);
const io = socket(server, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
	console.log("new user connect");
	socketController(io, socket);
});

const APP_PORT = process.env.PORT || 4010;

server.listen(APP_PORT, () => {
	console.log("listening on port " + APP_PORT);
});
