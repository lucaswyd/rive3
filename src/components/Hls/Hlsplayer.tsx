import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface HlsPlayerProps {
  src: string;
  width?: string;
  height?: string;
}

const HlsVideoPlayer: React.FC<HlsPlayerProps> = ({
  src,
  width = "100%",
  height = "auto",
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      if (videoRef.current) {
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // Deixe o usuário clicar para iniciar a reprodução
        });
      }
      return () => {
        hls.destroy();
      };
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
      videoRef.current.addEventListener("loadedmetadata", () => {
        // Deixe o usuário clicar para iniciar a reprodução
      });
    }
  }, [src]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div>
      {!isPlaying && <button onClick={handlePlay}>Play</button>}
      <video
        ref={videoRef}
        width={width}
        height={height}
        controls
        autoPlay={false}
      />
    </div>
  );
};

export default HlsVideoPlayer;
