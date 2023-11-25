import { CameraControls } from "@react-three/drei";
import { useRef } from "react";

export default function BaseScene() {
  const cameraControlRef = useRef<CameraControls | null>(null);
  return (
    <>
      <CameraControls ref={cameraControlRef} />
      <hemisphereLight intensity={0.5} />
      <pointLight distance={1} decay={6} position={[0, 0.5, -1.5]} />
      <gridHelper />
      <axesHelper />
    </>
  );
}
