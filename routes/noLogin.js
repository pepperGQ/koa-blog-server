const router = require("koa-router")();
const Mysql = require("../db");
const crypto = require('crypto');
// const SHA2 = require("crypto-js/sha256");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config/jwt");


function generateHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }
router.prefix("/noLogin");

router.post("/login", async (ctx, next) => {
	try {
		const { username, password } = ctx.request.body;
		// 检查用户名和密码是否为空
		if (!username || !password) {
			ctx.body = {
				code: -1,
				message: "用户名或密码不能为空",
				success: false,
			};
			return;
		}
		const results = await Mysql.query(
			`SELECT * FROM users WHERE username = ?`,
			[username]
		);
		// 检查用户是否存在
		if (results.length === 0) {
			ctx.body = {
				code: -1,
				message: "用户名不存在",
				success: false,
			};
			return;
		}
		// 检查密码是否正确
		const hashedPassword = results[0].password;
		if (hashedPassword !== generateHash(password).toString()) {
			ctx.body = {
				code: -1,
				message: "密码错误",
				success: false,
			};
			return;
		}
		const token = jwt.sign(
			{
				id: results[0].id,
			},
			JWT_SECRET,
			{ expiresIn: "24h" }
		);
		ctx.body = {
			code: 0,
			data: token,
			message: "登录成功",
			success: true,
		};
	} catch (error) {
		ctx.body = {
			code: -1,
			message: error.message,
			success: false,
		};
	}
});
module.exports = router;
