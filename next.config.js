/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };
// export default nextConfig;

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = withPWA({
  // next.js config
  reactStrictMode: true,

  async headers() {
    return [
      {
        // Aplica esses cabeçalhos a todas as rotas
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' wareztuga.pt wztuga.netlify.app;",
          },
          {
            key: "X-Frame-Options",
            value: "ALLOW-FROM wareztuga.pt",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/proxy/:path*",
        destination: "http://:path*",
      },
    ];
  },

  webpackDevMiddleware: (config) => {
    config.proxy = {
      "/proxy": {
        target: "http://",
        changeOrigin: true,
        pathRewrite: {
          "^/proxy": "",
        },
      },
    };
    return config;
  },
});
