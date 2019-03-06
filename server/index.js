const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const model = require('./model')


// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')


//Promise异步中间件错误捕获器
function wrap(fn){
    return (req, res, next) => fn(req, res, next).catch(next);
}


async function start() {

  //attach data model
  app.use(function(req, res, next){
    req.$model = model;
    next();
  })

  // app.get('/api/articles', function(req, res, next){
  //     console.log(JSON.stringify(req, ['url','complete','headers','rawHeaders','trailers','rawTrailers','url','statusCode','method','statusMessage','next','baseUrl','originalUrl','params','query',''],2))
  //     next();
  // })

  app.get('/api/articles', wrap(require('./controller')))

  app.get('/api/article', wrap(require('./controller/article')))

  app.get('/api/allArticles', wrap(require('./controller/allArticles')))

  //错误捕获
  app.use(function(err, req, res, next){
    console.error('err!', err);
    res.send({
        code: -1,
        msg: 'server error'
    })
  })

  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server

  require('./model/pool').init(() => {
    console.log('读取md文件完成')
    
    app.listen(port, host)
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true
    })
  })

}
start()
