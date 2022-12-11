const db = require("../config/db");

const userModel = {
	selectAll: () => {
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM users", (err, res) => {
				if (err) {
					reject(err);
				}
				resolve(res);
			});
		});
	},

	selectDetail: (id) => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT * FROM users where id = ${id}`, (err, res) => {
				if (err) {
					reject(err);
				}
				resolve(res);
			});
		});
	},

	register: ({ fullname, username, email, password, profile_pic }) => {
		return new Promise((resolve, reject) => {
			db.query(
				`INSERT INTO users (fullname, username, email, password, profile_pic)
      VALUES
      ($1, $2, $3, $4, $5)`,
				[fullname, username, email, password, profile_pic],
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},

	checkEmail: (email) => {
		return new Promise((resolve, reject) => {
			db.query(
				`
        SELECT * FROM users WHERE email = '${email}'
        `,
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},

	update: ({ id, fullname, username, bio, phone }) => {
		return new Promise((resolve, reject) => {
			db.query(
				`
        UPDATE users SET
        fullname = COALESCE ($1, fullname),
        username = COALESCE ($2, username),
        bio = COALESCE ($3, bio),
        phone = COALESCE ($4, phone)
        WHERE id = $5
        `,
				[fullname, username, bio, phone, id],
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},

	updateImage: (id, profile_pic) => {
		return new Promise((resolve, reject) => {
			db.query(
				`
			UPDATE users SET 
			profile_pic = '${profile_pic}' 
			WHERE id = ${id}`,
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},

	destroy: (id) => {
		return new Promise((resolve, reject) => {
			db.query(
				`
      DELETE FROM users WHERE id=${id}
      `,
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},
};

module.exports = userModel;
