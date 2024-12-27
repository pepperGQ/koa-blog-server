const Koa = require('koa')
const cors = require('koa2-cors')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const { koaBody } = require('koa-body');
const logger = require('koa-logger');
const path = require('path');

// cors 中间件应该在最前面配置
app.use(cors({
  origin: (ctx) => {
    const whitelist = [
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'http://localhost:5173',  // vite 默认端口
      'http://localhost:8080'   // 其他可能的开发端口
    ];
    const origin = ctx.request.header.origin;
    if (whitelist.includes(origin)) {
      return origin;
    }
    return false;
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization','Authorization']
}));
const index = require('./routes/index')
const users = require('./routes/users')
const noLogin = require('./routes/noLogin')
const post = require('./routes/post')
const currency = require('./routes/currency')

// error handler
onerror(app)

// middlewares
// 配置请求体来处理multipart/form-data类型的请求（主要用于文件上传）
app.use(koaBody({
  multipart: true, // 支持文件上传
  formidable: {
    uploadDir: path.join(__dirname, 'uploads/images'), // 设置文件上传目录
    keepExtensions: true, // 保持文件的后缀
    maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小限制，例如2MB
  }
}));
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(noLogin.routes(), noLogin.allowedMethods())
app.use(post.routes(), post.allowedMethods())
app.use(currency.routes(), currency.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
