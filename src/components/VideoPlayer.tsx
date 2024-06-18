// components/VideoPlayer.tsx
import React, { useRef, useEffect } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  src: string;
  type: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, type }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (Hls.isSupported() && type === "application/x-mpegURL") {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current as HTMLVideoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        (videoRef.current as HTMLVideoElement).play();
      });

      return () => {
        hls.destroy();
      };
    } else if (videoRef.current?.canPlayType(type)) {
      (videoRef.current as HTMLVideoElement).src = src;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current?.play();
      });
    }
  }, [src, type]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <video
        ref={videoRef}
        controls
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

export default VideoPlayer;
