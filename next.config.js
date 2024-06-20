// Tipo de configuração Next.js usando TypeScript
/** @type {import('next').NextConfig} */

// Configuração base do Next.js
// const nextConfig = {
//   reactStrictMode: true,
// };
// export default nextConfig;

// Configuração do PWA com o módulo next-pwa
// const withPWA = require("next-pwa")({
//   dest: "public", // Define o diretório de destino para os arquivos do service worker
//   register: true, // Ativa o registro automático do service worker
//   skipWaiting: true, // Permite que o service worker seja ativado imediatamente
// });

// Integração da configuração do PWA com o Next.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Desativa o PWA durante o desenvolvimento para facilitar o debugging
});

module.exports = withPWA({
  reactStrictMode: true, // Mantém o modo estrito do React
  // Configurações de cabeçalhos HTTP
  async headers() {
    return [
      {
        source: "/(.*)", // Aplica esses cabeçalhos a todas as rotas
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' wareztuga.pt wztuga.netlify.app;",
          },
          {
            key: "X-Frame-Options",
            value: "ALLOW-FROM wareztuga.pt", // Nota: ALLOW-FROM é obsoleto em muitos navegadores modernos
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
});

// Configuração final do next.js com PWA e cabeçalhos de segurança implementados
