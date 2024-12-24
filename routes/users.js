const router = require("koa-router")();
const Mysql = require("../db");
const authenticate = require("../middlewares/authenticate");

router.use(authenticate);
router.prefix("/users");

router.get("/", async (ctx, next) => {
	try {
		const users = await Mysql.query("SELECT * FROM users");
		const resUsers = users.map((item) => {
			return {
				id: item.id,
				name: item.username,
				email: item.email,
				createTime: item.created_at,
			};
		});
		ctx.body = {
			code: 0,
			data: resUsers,
			message: "success",
			success: true,
		};
    
	} catch (err) {
		ctx.body = {
			code: -1,
			message: err.message,
			success: false,
		};
	}
});

module.exports = router;
