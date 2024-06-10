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
          src="/images/logo.png"
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
          <p>Corrigimos o bug do botao nao funcionar em varios dispositivos.</p>
          <p>
            Experimente fazer o download do APP. Se o download não iniciar,
            desligue a tradução automática actualize a pagina e tente novamente,
            isso deve corrigir o problema do download do APP. Se ainda assim o
            download não iniciar, tente utilizar outro navegador de sua
            preferência. Estamos corrigindo alguns bugs na versão iOS. Para
            usuários de dispositivos iOS, pedimos sua compreensão e paciência.
          </p>
          <p>
            * O nosso APP e totalmente livre de Virus ou Malwares, utilizamos
            PWa, uma versao simplificada que converte o site em um aplicativo.
          </p>
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
