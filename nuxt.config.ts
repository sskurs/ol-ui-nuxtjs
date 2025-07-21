module.exports = {
  modules: [
    '@nuxtjs/proxy'
  ],
  proxy: {
    '/api/': {
      target: 'http://localhost:5000',
      pathRewrite: { '^/api/': '/api/' },
      changeOrigin: true,
      ws: false
    }
  }
} 