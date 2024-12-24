const Koa = require('koa')
const cors = require('koa2-cors')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

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

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
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

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
