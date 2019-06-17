const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const MarkdownIt = require('markdown-it')
const meta = require('markdown-it-meta')

// Make new instance
const md = new MarkdownIt()
// Add markdown-it-meta
md.use(meta)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

const onlyAPI = process.argv[2] === 'onlyAPI';

process.on('unhandledRejection', (err) => {
  console.error(err);
})

async function start() {
  // app.get('/api/articles', function(req, res, next){
  //     console.log(JSON.stringify(req, ['url','complete','headers','rawHeaders','trailers','rawTrailers','url','statusCode','method','statusMessage','next','baseUrl','originalUrl','params','query',''],2))
  //     next();
  // })

  let router = express.Router()
  router.get('/test', function(req, res, next){
    res.send('hello')
  })

  app.use(router)

  app.use('/api/blog', require('./controller/blog'))
  app.use('/api/poems', require('./controller/poems'))

  //错误捕获
  app.use(function(err, req, res, next){
    console.error('err!', err);
    res.send({
        code: -1,
        msg: 'server error'
    })
  })

  const host = process.env.HOST || '127.0.0.1';
  const port = process.env.PORT || 3000;

  !onlyAPI && await loadNuxt();

  require('./model/pool').init(() => {
    console.log('读取md文件完成')

    // Listen the server
    app.listen(port, host)
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true
    })
  })

}

async function loadNuxt(){
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)
}

start()
