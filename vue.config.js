module.exports = {
  devServer: {
    proxy: {
      "^/api*": {
        // target: "https://us-central1-line-bot-award.cloudfunctions.net",
        pathRewrite: { "^/api": "" },
        changeOrigin: true,
        logLevel: "debug",
      }
    }
  }
}