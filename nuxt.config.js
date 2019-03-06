const pkg = require('./package')
const axios = require('axios')
const config = require('./config')

module.exports = {
  mode: 'universal',
  generate: {
    routes: function () {
      return axios.get(`${config.host}/api/allArticles`)
      .then((res) => {
        return res.data.map(page => ({
          route: '/e/' + page.name,
          payload: page     
        }))
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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
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
    '@nuxtjs/pwa',
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
