const router = require("koa-router")();
const Mysql = require("../db");
const authenticate = require("../middlewares/authenticate");
const path = require("path");

router.use(authenticate);
router.prefix("/currency");

router.post("/upload/images", async (ctx, next) => {
	try {
		const file = ctx.request.files.file;
		if (!file) {
			ctx.body = {
				code: -1,
				message: "请上传图片",
				success: false,
			};
			return;
		}
        // console.log(ctx.request.files,'ctx.request.files'); // 调试信息
		// const ext = path.extname(file.originalFilename);
		// const fileName = `${Date.now()}-${Math.random()}${ext}`;
		// const savePath = path.join(__dirname, "uploads/images", fileName);
		// await file.toFile(savePath);
		ctx.body = {
			code: 0,
			message: "文件上传成功",
			data: `/uploads/${file.newFilename}`,
            success: true,
		};
	} catch (err) {
		ctx.body = {
			code: -1,
			message: `${err}`,
			success: false,
		};
	}
});

module.exports = router;
