import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Watch.module.scss";
import { IoReturnDownBack } from "react-icons/io5";

const FTWatch = () => {
  const [selectedServer, setSelectedServer] = useState("SUP");
  const [videoKey, setVideoKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const { query } = router;
    if (query.server) {
      setSelectedServer(query.server.toString());
    }
  }, [router]);

  const handleServerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedServer(event.target.value);
  };

  useEffect(() => {
    // Atualiza a chave do vídeo quando o servidor selecionado muda
    setVideoKey((prevKey) => prevKey + 1);
  }, [selectedServer]);

  const getVideoUrl = () => {
    switch (selectedServer) {
      case "STV1":
        return process.env.NEXT_PUBLIC_STREAM_URL_ST1;
      case "STV2":
        return process.env.NEXT_PUBLIC_STREAM_URL_ST2;
      case "STV3":
        return process.env.NEXT_PUBLIC_STREAM_URL_ST3;
      case "STV4":
        return process.env.NEXT_PUBLIC_STREAM_URL_ST4;
      case "STV5":
        return process.env.NEXT_PUBLIC_STREAM_URL_ST5;
      case "ELS1":
        return process.env.NEXT_PUBLIC_STREAM_URL_ELS1;
      case "ELS2":
        return process.env.NEXT_PUBLIC_STREAM_URL_ELS2;
      case "ELS3":
        return process.env.NEXT_PUBLIC_STREAM_URL_ELS3;
      case "BFTV":
        return process.env.NEXT_PUBLIC_STREAM_URL_BFTV;
      default:
        return process.env.NEXT_PUBLIC_STREAM_URL_SUP; // Servidor padrão
    }
  };

  return (
    <div className={styles.watch}>
      <div className={styles.backBtn}>
        <IoReturnDownBack data-tooltip-id="tooltip" data-tooltip-content="Voltar" />
      </div>
      <select
        name="server"
        id="server"
        className={styles.server}
        value={selectedServer}
        onChange={handleServerChange}
      >
        <option value="STV1">SPORT TV - 1</option>
        <option value="STV2">SPORT TV - 2</option>
        <option value="STV3">SPORT TV - 3</option>
        <option value="STV4">SPORT TV - 4</option>
        <option value="STV5">SPORT TV - 5</option>
        <option value="ELS1">ELEVEN SPORTS - 1</option>
        <option value="ELS2">ELEVEN SPORTS - 2</option>
        <option value="ELS3">ELEVEN SPORTS - 3</option>
        <option value="BFTV">BENFICA TV</option>
        {/* Adicione mais opções para os outros servidores, conforme necessário */}
      </select>
      <div className={styles.videoContainer}>
      <iframe
          key={videoKey} // Use uma chave única para forçar a atualização do iframe
          scrolling="no"
          src={getVideoUrl()}
          className={styles.iframe}
          allowFullScreen
          allow="autoplay"
          sandbox="allow-same-origin allow-scripts allow-top-navigation=false" 
        ></iframe>
      </div>
    </div>
  );
};

export default FTWatch;
