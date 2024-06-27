import React, { useState, useEffect } from "react";
import styles from "../components/Navbar.module.scss";

const DownloadButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleDownload = async () => {
    if (isIOS) {
      alert(
        "Para adicionar o app à sua tela inicial no iOS, toque no ícone de compartilhamento e selecione 'Adicionar à Tela de Início'.",
      );
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <button onClick={handleDownload} className={styles.downloadButton}>
      Download App
    </button>
  );
};

export default DownloadButton;
