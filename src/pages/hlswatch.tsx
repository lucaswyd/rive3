import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import HlsPlayer from "react-hls-player";
import styles from "@/styles/Watchft.module.scss";
import { IoReturnDownBack } from "react-icons/io5";

const Hlswatch = () => {
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
    setVideoKey((prevKey) => prevKey + 1);
  }, [selectedServer]);

  const getVideoUrl = () => {
      switch (selectedServer) {
          case "SIC":
              return process.env.NEXT_PUBLIC_STREAM_URL_SIC;
          case "TVI":
              return process.env.NEXT_PUBLIC_STREAM_URL_TVI;
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
              <option value="SIC">SIC</option>
              <option value="TVI">TVI</option>

      </select>
      <div className={styles.videoContainer}>
        <HlsPlayer
          key={videoKey}
          src={getVideoUrl()}
          autoPlay={false}
          controls={true}
          width="100%"
          height="auto"
        />
      </div>
    </div>
  );
};

export default Hlswatch;
