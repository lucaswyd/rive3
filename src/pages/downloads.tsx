import { useState, useEffect } from "react";
import styles from "@/styles/Settings.module.scss";

const LoginPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleDownload = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setDeferredPrompt(null);
        }
      } catch (error) {
        console.error("Erro ao iniciar o download:", error);
      }
    } else {
      alert("O seu navegador não suporta a instalação de PWAs.");
    }
  };

  return (
    <div className={`${styles.settingsPage} ${styles.authPage}`}>
      <div className={styles.logo}>
        <img
          src="/images/logolmg.png"
          alt="logo"
          data-tooltip-id="tooltip"
          data-tooltip-content="Rive"
        />
        <p>WarezAPP</p>
      </div>
      <div className={styles.settings}>
        <h1>Downloads</h1>
        <div className={styles.group2}>
          <h1>App Beta v2</h1>
          <p>
            Isso instalará o aplicativo para todos os dispositivos ocupando
            pouca memória e dados móveis
          </p>
          <p>
            Baixe usando qualquer Navegador, utilize AD-Block para tentar
            remover ou minimizar a publicidade dos Players
          </p>
          <p>
            Se o download não iniciar ou o botão não funcionar, desligue a
            tradução automática, atualize e tente novamente!
          </p>
          <p>
            * Por favor, note que o App ainda está em fase de teste, bugs e
            erros serão corrigidos com o tempo.
          </p>
          {/* <p>To download movies/tv shows, go to it's watch page, and use extensions like FetchV</p> */}
          <button
            className={styles.downloadButton}
            onClick={handleDownload}
            data-tooltip-id="tooltip"
            data-tooltip-content="Download PWA"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
