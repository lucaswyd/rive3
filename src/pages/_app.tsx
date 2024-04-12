// Importar dependências
import Head from "next/head";
import { useEffect, useState } from "react";
import Router from "next/router";

// Importar estilos globais
import "@/styles/globals.scss";
import Layout from "@/components/Layout";
import { Toaster } from "sonner";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import NProgress from "nprogress";
import "react-loading-skeleton/dist/skeleton.css";

export default function App({ Component, pageProps }: any) {
  const [isLoading, setIsLoading] = useState(false);

  // Configurar o NProgress
  NProgress.configure({ showSpinner: false });

  // Efeito para lidar com as mudanças de rota
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
      NProgress.start();
    };

    const handleRouteChangeComplete = () => {
      setIsLoading(false);
      NProgress.done(false);
    };

    const handleRouteChangeError = () => {
      setIsLoading(false);
    };

    // Registrar os eventos de mudança de rota
    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);
    Router.events.on("routeChangeError", handleRouteChangeError);

    // Remover os eventos ao desmontar o componente
    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
      Router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, []);

  // Efeito para adicionar os scripts de analytics
  useEffect(() => {
    const script = document.createElement("script");
    script.id = "_waubyv";
    script.innerHTML = `var _wau = _wau || []; _wau.push(["dynamic", "8vab3h8jp8", "byv", "c4302bffffff", "small"]);`;
    document.body.appendChild(script);

    const asyncScript = document.createElement("script");
    asyncScript.src = "//waust.at/d.js";
    asyncScript.async = true;
    document.body.appendChild(asyncScript);

    // Remover os scripts ao desmontar o componente
    return () => {
      document.body.removeChild(script);
      document.body.removeChild(asyncScript);
    };
  }, []);

  // Retornar a estrutura da aplicação
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
        {/* <link rel="mask-icon" href="/images/logo512.svg" color="#f4f7fe" /> */}
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
