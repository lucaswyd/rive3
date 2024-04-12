import { useState, useEffect } from "react";
import styles from "@/styles/Settings.module.scss";
const LoginPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>();
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);
  const handleDownload = async () => {
    if (deferredPrompt !== null && deferredPrompt !== undefined) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
  };
  return (
    <div className={`${styles.settingsPage} ${styles.authPage}`}>
      <div className={styles.logo}>
        <img
          src="/images/logo.svg"
          alt="logo"
          data-tooltip-id="tooltip"
          data-tooltip-content="Rive"
        />
        <p>WZTuga</p>
      </div>
      <div className={styles.settings}>
        <h1>Downloads</h1>
        <div className={styles.group2}>
          <h1>PWA</h1>
          <p>
          Isso instalará o aplicativo para todos os dispositivos ocupando pouca memória e dados móveis
          </p>
          <p>
          Baixe usando qualquer Navegador, utilize AD-Block para tentar remover ou minimizar a publicidade dos Players
          </p>
          <p>Se o download não iniciar ou o botão não funcionar, desligue a tradução automática, atualize e tente novamente!</p>
          {/* <p>To download movies/tv shows, go to it's watch page, and use extensions like FetchV</p> */}
          <h4
            className={styles.downloadButton}
            onClick={handleDownload}
            data-tooltip-id="tooltip"
            data-tooltip-content="Download PWA"
          >
            Download
          </h4>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
