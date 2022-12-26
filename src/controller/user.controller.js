const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwtToken = require("../helper/generateJWT");
const { success, failed, successWithToken } = require("../helper/file.respons");
const cloudinary = require("../helper/cloudinary");

const userController = {
	list: (req, res) => {
		userModel
			.selectAll()
			.then((results) => {
				success(res, results, "success", "get all user success");
			})
			.catch((err) => {
				failed(res, err.message, "failed", "get all user failed");
			});
	},
	detail: (req, res) => {
		const id = req.params.id;
		userModel
			.selectDetail(id)
			.then((results) => {
				success(res, results.rows, "success", "get user success");
			})
			.catch((err) => {
				failed(res, err.message, "failed", "get all user failed");
			});
	},

	register: (req, res) => {
		try {
			const { fullname, username, email, password } = req.body;
			bcrypt.hash(password, 10, async (err, hash) => {
				if (err) {
					failed(res, err.message, "failed", "fail hash password");
				}
				const profile_pic = req.file
					? await cloudinary.uploader.upload(req.file.path)
					: {
							secure_url:
								"https://res.cloudinary.com/dhm4yjouq/image/upload/v1667923907/cld-sample.jpg",
					  };

				const data = {
					fullname,
					username,
					email,
					password: hash,
					profile_pic: `${profile_pic.secure_url}`,
				};

				userModel.checkEmail(email).then((result) => {
					if (result.rowCount == 0) {
						userModel
							.register(data)
							.then((result) => {
								success(res, result, "success", "Akun berhasil dibuat");
							})
							.catch((err) => {
								failed(res, err.message, "failed", "Gagal membuat akun");
							});
					}

					if (result.rowCount > 0) {
						failed(res, null, "failed", "Email telah terdaftar");
					}
				});
			});
		} catch (err) {
			failed(res, err.message, "failed", " internal server error");
		}
	},

	login: (req, res) => {
		const { email, password } = req.body;
		userModel
			.checkEmail(email)
			.then((result) => {
				const user = result.rows[0];
				if (result.rowCount > 0) {
					bcrypt
						.compare(password, result.rows[0].password)
						.then(async (result) => {
							if (result) {
								const token = await jwtToken({
									username: user.username,
								});
								delete user.password;
								success(
									res,
									{
										token,
										data: user,
									},
									"success",
									"login success"
								);
							} else {
								// ketika pass salah
								failed(res, null, "failed", "email atau password salah");
							}
						});
				} else {
					// ketika username salah
					failed(res, null, "failed", "email atau password salah");
				}
			})
			.catch((err) => {
				failed(res, err.message, "failed", "internal server error");
			});
	},

	update: (req, res) => {
		// tangkap data dari body
		const id = req.params.id;
		const { fullname, username, bio, phone } = req.body;

		const data = {
			id,
			fullname,
			username,
			bio,
			phone,
		};

		userModel
			.update(data)
			.then((results) => {
				res.json(results);
			})
			.catch((err) => {
				res.json(err);
			});
	},

	updateImage: async (req, res) => {
		const id = req.params.id;
		const images = await cloudinary.uploader.upload(req.file.path);
		const data = {
			profile_pic: `${images.secure_url}`,
		};
		userModel
			.updateImage(id, data.profile_pic)
			.then((results) => {
				res.json(results);
			})
			.catch((err) => {
				res.json(err);
			});
	},

	destroy: (req, res) => {
		const id = req.params.id;
		userModel
			.destroy(id)
			.then((results) => {
				res.json(results);
			})
			.catch((err) => {
				res.json(err);
			});
	},
};

module.exports = userController;
