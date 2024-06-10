import React, { useRef, useEffect } from "react";
import Fluid from "webgl-fluid";

const WebGLFluid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      Fluid(canvasRef.current);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: "-1",
        pointerEvents: "none", // Ensures it doesn't interfere with mouse events
      }}
    ></canvas>
  );
};

export default WebGLFluid;
