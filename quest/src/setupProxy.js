const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://quest-backend.ourcender.com",
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        "^/api": "",
      },
    })
  );
};
