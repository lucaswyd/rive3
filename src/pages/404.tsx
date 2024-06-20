import styles from "@/styles/Settings.module.scss";
const ErrorPage = () => {
  return (
    <div className={`${styles.settingsPage} ${styles.authPage}`}>
      <div className={styles.logo}>
        <img src="/images/logolmg.svg" alt="logo" />
        <p>App de Filmes e Series gratuito</p>
      </div>
      <div className={styles.errorData}>
        <h1>404</h1>
        <p>Pagina nao encontrada</p>
      </div>
    </div>
  );
};

export default ErrorPage;
