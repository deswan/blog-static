const pkg = require('./package')
const axios = require('axios')
const config = require('./config')
const _ = require('lodash')

module.exports = {
  mode: 'universal',
  generate: {
    async routes() {
      // 获取全部blog数据
      return Promise.all([
        axios.get(`${config.host}/api/blog/all`)
        .then((res) => {
          let data = res.data;
          let list = data.list.map(item => ({
            route: '/page/' + item.page,
            payload: item
          }));
          let details = _.flatMap(data.list, ({ items }) => (
            _.map(items, item => ({
              route: '/e/' + item.name,
              payload: item
            }))
          ))
          return [].concat(list, details)
        }),
      ]).then(routes => {
        return _.flatten(routes)
      })
    }
  },
  router: {
    extendRoutes (routes, resolve) {
      // 将路径 /page/xxx 渲染到首页
      routes.push({
        name: 'page',
        path: '/page/:page',
        component: resolve(__dirname, 'pages/index.vue')
      })
    }
  },
  /*
  ** Headers of the page
  */
  head: {
    title: "Star`s Blog",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'shortcut icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/load_assets'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // '@nuxtjs/pwa',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, { isClient }) {
    }
  }
}
