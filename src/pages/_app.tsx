import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import Layout from '@/components/Layout';
import Head from 'next/head';
import { Toaster } from 'sonner';
import { Tooltip } from 'react-tooltip';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'react-loading-skeleton/dist/skeleton.css';
import '@/styles/globals.scss';
import '@/styles/checkbox.scss';
import '@/styles/nprogress.scss';
import 'react-tooltip/dist/react-tooltip.css';

export default function App({ Component, pageProps }: any) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on('routeChangeStart', () => {
      setIsLoading(true);
      NProgress.start();
    });

    Router.events.on('routeChangeComplete', () => {
      setIsLoading(false);
      NProgress.done(false);
    });

    Router.events.on('routeChangeError', () => {
      setIsLoading(false);
    });

    // Desativar as React Developer Tools em ambiente de produção
    if (process.env.NODE_ENV === 'production') {
      disableReactDevTools();
    }
  }, []);

  return (
    <>
      <Head>
        <title>WarezTuga</title>
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
            className: 'sooner-toast-desktop',
          }}
          position="bottom-right"
        />
        <Toaster
          toastOptions={{
            className: 'sooner-toast-mobile',
          }}
          position="top-center"
        />
        <Tooltip id="tooltip" className="react-tooltip" />
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
