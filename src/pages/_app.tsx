import "@/styles/globals.scss";
import Layout from "@/components/Layout";
import Head from "next/head";
import { Toaster, toast } from "sonner";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import Router from "next/router";
import { useState, useEffect } from "react";
import NProgress from "nprogress";
import "@/styles/nprogress.scss";
import "react-loading-skeleton/dist/skeleton.css";
import { QueryClient, QueryClientProvider } from "react-query"; // Import react-query
import Navbar from "@/components/Navbar"; // Importar o Navbar
import DownloadButton from "@/pages/DownloadButton"; // Importar o DownloadButton

const defaultColors = {
  ascent_color: "gold",
  bg_color: "#f4f7fe",
  bg_gradient: "rgba(238, 235, 235, 0.8)",
  primary_1: "rgb(255, 255, 255)",
  primary_2: "#64748b",
  primary_3: "#52525b",
  primary_4: "black",
  watchPageBtn: "rgb(255, 255, 255)",
};

const applyColors = (colors: any) => {
  Object.keys(colors).forEach((color) => {
    document.documentElement.style.setProperty(
      `--${color.replace(/_/g, "-")}`,
      colors[color],
    );
  });
};

export default function App({ Component, pageProps }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [queryClient] = useState(() => new QueryClient()); // Initialize QueryClient

  NProgress.configure({ showSpinner: false });

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      setIsLoading(true);
      NProgress.start();
    };

    const handleRouteChangeComplete = (url: string) => {
      setIsLoading(false);
      NProgress.done(false);
    };

    const handleRouteChangeError = (url: string) => {
      setIsLoading(false);
    };

    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);
    Router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
      Router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const DisableDevtool = require("disable-devtool");
      DisableDevtool();

      // Recupera as cores personalizadas do localStorage e aplica
      const savedColors = localStorage.getItem("colors");
      if (savedColors) {
        const parsedColors = JSON.parse(savedColors);
        applyColors(parsedColors);
      } else {
        applyColors(defaultColors);
      }

      // Exibe o toast de manutenção
      // toast.info("Atualização concluida com sucesso..", {});
    }

    // Adicionar os scripts de analytics
    const script = document.createElement("script");
    script.id = "_waubyv";
    script.innerHTML = `
      var _wau = _wau || [];
      _wau.push(["dynamic", "8vab3h8jp8", "byv", "c4302bffffff", "small"]);
    `;
    document.head.appendChild(script);

    const asyncScript = document.createElement("script");
    asyncScript.src = "//waust.at/d.js";
    asyncScript.async = true;
    document.head.appendChild(asyncScript);

    // Adicionar estilo para display: none ao elemento de analytics
    const style = document.createElement("style");
    style.innerHTML = `
      #_waubyv,
      script[src="//waust.at/d.js"] {
        display: none;
      }
    `;
    document.head.appendChild(style);

    // Retornar a função de cleanup para remover os scripts e estilos ao desmontar o componente
    return () => {
      document.head.removeChild(script);
      document.head.removeChild(asyncScript);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <Head>
        <title>
          Wareztuga - Assistir Filmes Online HD Legendado, Assistir Series
          Online HD Legendado, Assistir Futebol Online Grátis
        </title>
        <meta name="description" content="Filmes Online HD Legendado Gratis" />
        <meta
          name="keywords"
          content="Você quer assistir filmes e séries online sem anúncios gratis ? Acesse já o Wareztuga! Filmes, Series, Futebol, Televisao, tudo em um só lugar! "
        />
        <link rel="manifest" href="manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rive" />
        <link rel="icon" href="/images/logolmg.svg" />
        <link rel="apple-touch-icon" href="/images/logolmg.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#f4f7fe" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="shortcut icon" href="/images/logolmg.svg" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <div className="top-bar">
          <DownloadButton /> {/* Adicionar DownloadButton aqui */}
        </div>
        <Layout>
          <Toaster
            toastOptions={{
              className: "sooner-toast-desktop",
            }}
            position="bottom-right"
          />
          <Toaster
            toastOptions={{
              className: "sooner-toast-mobile",
            }}
            position="top-center"
          />
          <Tooltip id="tooltip" className="react-tooltip" />
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </>
  );
}
