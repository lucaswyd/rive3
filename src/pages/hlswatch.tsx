import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Hls from "hls.js";
import styles from "@/styles/Watchft.module.scss";
import { IoReturnDownBack } from "react-icons/io5";

const Hlswatch = () => {
  const [selectedServer, setSelectedServer] = useState("SUP");
  const [videoKey, setVideoKey] = useState(0);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

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
      default:
        return "";
    }
  };

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls();
      hls.loadSource(getVideoUrl());
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });

      return () => {
        hls.destroy();
      };
    } else if (
      videoRef.current &&
      videoRef.current.canPlayType("application/vnd.apple.mpegurl")
    ) {
      videoRef.current.src = getVideoUrl();
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current.play();
      });
    }
  }, [selectedServer]);

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
        <option value="SIC">SIC</option>
        <option value="TVI">TVI</option>
      </select>
      <div className={styles.videoContainer}>
        <video
          key={videoKey}
          ref={videoRef}
          controls
          width="100%"
          height="auto"
        />
      </div>
    </div>
  );
};

export default Hlswatch;
