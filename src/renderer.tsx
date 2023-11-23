import { useRef, useContext } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CameraControls } from "@react-three/drei";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import { EditorContext } from "./providers/editorContextProvider.tsx";
import VrmModel from "./vrmModel.tsx";

export default function ThreeJSRenderer() {
  const editorContext = useContext(EditorContext);

  const cameraControlRef = useRef<CameraControls | null>(null);

  const defaultVRMGLTF = useLoader(
    GLTFLoader,
    "./vrmModels/novrmplaceholder.vrm",
    (loader) => {
      loader.register((parser) => {
        return new VRMLoaderPlugin(parser);
      });
    }
  );

  return (
    <Canvas style={{ backgroundColor: "black" }}>
      <CameraControls ref={cameraControlRef} />
      <hemisphereLight intensity={0.5} />
      <pointLight distance={1} decay={6} position={[0, 0.5, -1.5]} />
      <gridHelper />
      <axesHelper />
      {editorContext.threeGLTF ? (
        <VrmModel vrm={editorContext.threeGLTF.userData.vrm} />
      ) : (
        <VrmModel vrm={defaultVRMGLTF.userData.vrm} />
      )}
    </Canvas>
  );
}
