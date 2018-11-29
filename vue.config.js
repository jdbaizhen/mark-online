module.exports = {
  devServer: {
    proxy: {
      "/": {
        target: "http://192.168.3.84:8777",
        ws: false,
        changeOrigin: true
      }
    }
  }
}