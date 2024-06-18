// components/IPTVPlayer.tsx
import React from "react";
import VideoPlayer from "./VideoPlayer";

interface IPTVPlayerProps {
  src: string;
}

const IPTVPlayer: React.FC<IPTVPlayerProps> = ({ src }) => {
  const getVideoType = (url: string) => {
    if (url.endsWith(".m3u8")) {
      return "application/x-mpegURL";
    } else if (url.endsWith(".mpd")) {
      return "application/dash+xml";
    } else if (url.endsWith(".mp4")) {
      return "video/mp4";
    } else if (url.endsWith(".m3u")) {
      return "application/vnd.apple.mpegurl";
    } else {
      return "video/mp4";
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
