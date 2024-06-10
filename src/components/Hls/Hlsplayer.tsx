import React from 'react';
import HlsPlayer from 'react-hls-player';

interface HlsPlayerProps {
  src: string;
  width?: string;
  height?: string;
}

const HlsVideoPlayer: React.FC<HlsPlayerProps> = ({ src, width = '100%', height = 'auto' }) => {
  return (
    <HlsPlayer
      src={src}
      width={width}
      height={height}
      controls={true}
      autoPlay={false}
    />
  );
};

export default HlsVideoPlayer;
