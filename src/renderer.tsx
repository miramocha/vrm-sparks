import React, { useRef, useContext, useState } from "react";
import { AnimationMixer } from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CameraControls } from "@react-three/drei";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import { AppContext } from "./providers/appContextProvider.tsx";
import VrmModel from "./vrmModel.tsx";

export default function ThreeJSRenderer() {
  const appContext = useContext(AppContext);

  const cameraControlRef = useRef<CameraControls | null>(null);
  //   appContext.getCameraControls = () => cameraControlRef?.current;

  const defaultVRMGLTF = useLoader(
    GLTFLoader,
    "./vrmModels/novrmplaceholder.vrm",
    (loader) => {
      loader.register((parser) => {
        return new VRMLoaderPlugin(parser);
      });
    }
  );
  const [vrmGLTF, setVRMGLTF] = useState(defaultVRMGLTF);
  appContext.getVRMGLTF = () => vrmGLTF;
  appContext.setVRMGLTF = setVRMGLTF as React.Dispatch<GLTF>;

  const [mainAnimationMixer, setMainAnimationMixer] = useState(
    new AnimationMixer(defaultVRMGLTF.userData.vrm.scene)
  );
  appContext.getMainAnimationMixer = () => mainAnimationMixer;
  appContext.setMainAnimationMixer = setMainAnimationMixer;

  return (
    <Canvas style={{ backgroundColor: "black" }}>
      <CameraControls ref={cameraControlRef} />
      <hemisphereLight intensity={0.5} />
      <pointLight distance={1} decay={6} position={[0, 0.5, -1.5]} />
      <gridHelper />
      <axesHelper />
      {vrmGLTF?.userData?.vrm ? (
        <>
          <VrmModel vrm={vrmGLTF.userData.vrm} mixer={mainAnimationMixer} />
        </>
      ) : null}
    </Canvas>
  );
}
