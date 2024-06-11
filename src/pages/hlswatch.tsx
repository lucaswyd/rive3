import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Hls from "hls.js";
import styles from "@/styles/Watchft.module.scss";
import { IoReturnDownBack } from "react-icons/io5";

const Hlswatch = () => {
  const [selectedServer, setSelectedServer] = useState("SIC");
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const { query } = router;
    if (query.server) {
      setSelectedServer(query.server.toString());
    }
  }, [router]);

  const handleServerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedServer(event.target.value);
  };

  const getVideoUrl = (): string => {
    switch (selectedServer) {
      case "SIC":
        return process.env.NEXT_PUBLIC_STREAM_URL_SIC || "";
      case "TVI":
        return process.env.NEXT_PUBLIC_STREAM_URL_TVI || "";
      default:
        return "";
    }
  };

  useEffect(() => {
    const videoUrl = getVideoUrl();
    if (Hls.isSupported() && videoRef.current && videoUrl) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Manifest parsed successfully");
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            console.error("Failed to play video:", error);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", event, data);
      });

      return () => {
        hls.destroy();
      };
    } else if (
      videoRef.current &&
      videoRef.current.canPlayType("application/vnd.apple.mpegurl")
    ) {
      videoRef.current.src = videoUrl;
      videoRef.current.addEventListener("loadedmetadata", () => {
        console.log("Metadata loaded");
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            console.error("Failed to play video:", error);
          });
        }
      });
    } else {
      console.error("HLS is not supported in this browser.");
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
          ref={videoRef}
          controls
          width="100%"
          height="auto"
          autoPlay={false}
        />
      </div>
    </div>
  );
};

export default Hlswatch;
