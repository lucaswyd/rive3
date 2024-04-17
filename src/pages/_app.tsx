import "@/styles/globals.scss";
import Layout from "@/components/Layout";
import Head from "next/head";
import { Toaster } from "sonner";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import Router from "next/router";
import { useState, useEffect } from "react";
import NProgress from "nprogress";
import "@/styles/nprogress.scss";
import "react-loading-skeleton/dist/skeleton.css";

export default function App({ Component, pageProps }: any) {
  const [isLoading, setIsLoading] = useState(false);
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
    // Verificar se estamos no navegador antes de chamar a função DisableDevtool
    if (typeof window !== "undefined") {
      const DisableDevtool = require("disable-devtool");
      DisableDevtool();
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
    #_waubyv, // id do primeiro script
    script[src="//waust.at/d.js"] { // script async
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
        <title>Wareztuga</title>
        <meta name="description" content="Your Personal Streaming Oasis" />
        <meta
          name="keywords"
          content="movie, streaming, tv, rive, stream. movie app, tv shows, movie download"
        />
        <link rel="manifest" href="manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rive" />
        <link rel="icon" href="/images/logo512.png" />
        <link rel="apple-touch-icon" href="/images/logo512.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#f4f7fe" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="shortcut icon" href="/images/logo512.png" />
      </Head>
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
    </>
  );
}
