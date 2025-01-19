module.exports = {
  devServer: {
    proxy: {
      "^/hunger-gourmet/asia-northeast1*": {
        target: "http://127.0.0.1:5001",
        changeOrigin: true,
        logLevel: "debug",
      }
    }
  }
}