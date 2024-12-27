const router = require("koa-router")();
const Mysql = require("../db");
const authenticate = require("../middlewares/authenticate");

router.use(authenticate);
router.prefix("/post");

router.get("/getPostPage", async (ctx, next) => {
	try {
		const posts = await Mysql.query("SELECT * FROM posts");
		const res = posts.map((item) => {
			return {
                ...item,
				id: item.id,
				title: item.title,
				content: item.content,
				createTime: item.created_at,
			};
		});
		ctx.body = {
			code: 0,
			data: res,
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
