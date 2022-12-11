const pg = require("pg");
require("dotenv").config();

const db = new pg.Pool({
	host: process.env.DB_HOSTNAME,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
});

db.connect((err) => {
	if (err) {
		console.log(err);
	}
	console.log("database terhubung");
});

module.exports = db;
