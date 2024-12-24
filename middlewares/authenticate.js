const jwt = require("jsonwebtoken");

const JWT_SECRET = require("../config/jwt");

const authenticate = async (ctx, next) => {
	// 从HTTP头部中提取令牌
	const authHeader = ctx.get('Authorization');
	if (!authHeader) {
		ctx.status = 401;
		ctx.body = {
			code: -1,
			msg: "1用户信息验证失败！",
		};
		return;
	}

	// 提取Bearer之后的token
	const token = authHeader.split(" ")[1];
	if (!token) {
		ctx.status = 401;
		ctx.body = {
			code: -1,
			msg: "3用户信息验证失败！",
		};
		return;
	}

	try {
		// 验证令牌
		const decoded = jwt.verify(token, JWT_SECRET);
		// 将用户信息添加到上下文对象中，以便在路由处理程序中使用
		ctx.state.user = decoded;
		await next();
	} catch (err) {
		ctx.status = 401;
		ctx.body = {
			code: -1,
			msg: "3用户信息验证失败！",
		};
	}
};

module.exports = authenticate;
