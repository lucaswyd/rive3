import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../components/Comentarios/style.module.scss";

const Comentarios: React.FC = () => {
  useEffect(() => {
    toast.info(
      "O canal de chat foi movido. Entre no canal Discord para não perder nenhuma atualização, pedir conteúdo, reportar bugs e falhas, e interagir com a comunidade.",
    );
  }, []);

  return (
    <>
      <ToastContainer />
      <div className={styles.discordWidget}>
        <iframe
          src="https://discord.com/widget?id=1252969514593685515&theme=dark"
          width="350"
          height="500"
          allowTransparency={true}
          frameBorder="0"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        ></iframe>
      </div>
    </>
  );
};

export default Comentarios;
