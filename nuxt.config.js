const isDev = process.env.NODE_ENV !== 'production'

export default {
  mode: 'spa',
  // https://nuxtjs.org/api/configuration-modern
  modern: !isDev,

  // https://nuxtjs.org/api/configuration-head
  head: {
    titleTemplate(title) {
      if (title) {
        return `${title} - Nuxt PWA Vuetify`
      }
      return 'Nuxt PWA Vuetify'
    }
  },

  // https://nuxtjs.org/api/configuration-modules
  modules: [
    '@nuxtjs/axios',
    // https://http.nuxtjs.org/
    '@nuxt/http',

    // https://pwa.nuxtjs.org/
    '@nuxtjs/pwa',

    // https://github.com/nuxt-community/sitemap-module
    '@nuxtjs/sitemap',
    '@nuxtjs/moment'

    // https://github.com/nuxt-community/sentry-module
    // "@nuxtjs/sentry",

    // https://github.com/nuxt-community/analytics-module
    // [
    //   "@nuxtjs/google-analytics",
    //   {
    //     // TODO: Change this id to your Google Analytics ID
    //     id: process.env.GOOGLE_ANALYTICS
    //   }
    // ]
  ],

  devModules: [
    // Simple usage
    '@nuxtjs/vuetify'
  ],

  http: { baseURL: 'http://localhost:1337/' },

  vuetify: {
    treeShake: true
  },

  // https://nuxtjs.org/api/configuration-plugins
  plugins: [
    '~plugins/vee-validate',
    { src: '~plugins/vue-echarts', ssr: false }
  ],

  // https://nuxtjs.org/api/configuration-css
  css: ['~assets/styles/app'],

  // https://nuxtjs.org/api/configuration-build
  build: {
    extractCSS: !isDev,
    transpile: ['vue-echarts', 'resize-detector'],
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            fix: true
          }
        })
      }
    }
  }
}
