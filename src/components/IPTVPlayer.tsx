// components/IPTVPlayer.tsx
import React from "react";
import VideoPlayer from "./VideoPlayer";

interface IPTVPlayerProps {
  src: string;
}

const IPTVPlayer: React.FC<IPTVPlayerProps> = ({ src }) => {
  const getVideoType = (url: string) => {
    if (url.includes(".m3u8")) {
      return "application/x-mpegURL";
    } else if (url.includes(".mpd")) {
      return "application/dash+xml";
    } else if (url.includes(".mp4")) {
      return "video/mp4";
    } else if (url.includes(".m3u")) {
      return "application/vnd.apple.mpegurl";
    } else if (url.includes(".ts")) {
      return "video/MP2T";
    } else {
      // Outros formatos comuns de IPTV podem ser tratados aqui
      return "application/octet-stream"; // Tipo de arquivo genérico
    }
  };

  return (
    <div>
      <h2>IPTV Player</h2>
      <VideoPlayer src={src} type={getVideoType(src)} />
    </div>
  );
};

export default IPTVPlayer;
