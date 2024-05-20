// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };
// export default nextConfig;

// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
// });
// module.exports = withPWA({
//   // next.js config
// });


// next.config.js
module.exports = {
    async headers() {
      return [
        {
          // Aplica esses cabeçalhos a todas as rotas
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "frame-ancestors 'self' wareztuga.pt wztuga.netlify.app;",
            },
            {
              key: 'X-Frame-Options',
              value: 'ALLOW-FROM wareztuga.pt',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
          ],
        },
      ];
    },
  };
  