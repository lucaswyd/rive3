import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Watchft.module.scss";
import { IoReturnDownBack } from "react-icons/io5";

const FTWatch: React.FC = () => {
  const [selectedServer, setSelectedServer] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { query } = router;
    if (query.server) {
      setSelectedServer(query.server.toString());
    }
  }, [router]);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      if (!selectedServer) return;
      try {
        console.log(`Fetching video URL for server: ${selectedServer}`);
        const res = await fetch(`/api/stream?server=${selectedServer}`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log(`Fetched video URL: ${data.url}`);
        setVideoUrl(data.url);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch video URL:", error);
        setError("Failed to fetch video URL");
      }
    };

    fetchVideoUrl();
  }, [selectedServer]);

  const handleServerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedServer(event.target.value);
  };

  return (
    <div className={styles.watch}>
      <div className={styles.backBtn}>
        <IoReturnDownBack
          data-tooltip-id="tooltip"
          data-tooltip-content="Voltar"
        />
      </div>
      <select
        name="server"
        id="server"
        className={styles.server}
        value={selectedServer}
        onChange={handleServerChange}
      >
        <option value="">Selecione um servidor</option>
        <option value="STV1">SPORT TV - 1</option>
        <option value="STV2">SPORT TV - 2</option>
        <option value="STV3">SPORT TV - 3</option>
        <option value="STV4">SPORT TV - 4</option>
        <option value="STV5">SPORT TV - 5</option>
        <option value="ELS1">ELEVEN SPORTS - 1</option>
        <option value="ELS2">ELEVEN SPORTS - 2</option>
        <option value="ELS3">ELEVEN SPORTS - 3</option>
        <option value="BFTV">BENFICA TV</option>
      </select>
      <div className={styles.videoContainer}>
        {error ? (
          <p>{error}</p>
        ) : (
          videoUrl && (
            <iframe
              src={videoUrl}
              className={styles.iframe}
              allowFullScreen
              allow="autoplay"
              loading="lazy"
              sandbox="allow-same-origin allow-scripts"
              width="100%"
              height="100%"
              frameBorder="0"
            ></iframe>
          )
        )}
      </div>
    </div>
  );
};

export default FTWatch;
