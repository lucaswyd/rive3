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
        <p>Download WarezAPP</p>
      </div>
      <div className={styles.settings}>
        <h1>Downloads</h1>
        <div className={styles.group2}>
          <h1>Warez APP</h1>
          <p>
            Corrigimos alguns bugs do download do App em alguns navegadores
          </p>
          <p>
            Experimente fazer o download do APP, se o download nao iniciar desligue a traducao automatica e tente novamente.
            Se nao inciar o download tente utilizar outro navegador de sua preferencia.
            Ainda estamos corrigindo alguns bugs na versao IOs, para utilizadores de modelos IOs, pedimos a sua compreesao e paciencia
          </p>
          <p></p>
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
