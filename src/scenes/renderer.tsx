import { useContext } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import { EditorContext } from "../providers/editorContextProvider.tsx";
import VrmModel from "./vrmModel.tsx";
import BaseScene from "./baseScene.tsx";

export default function Renderer() {
  const editorContext = useContext(EditorContext);

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
    <Canvas>
      <BaseScene />
      {editorContext.threeGLTF ? (
        <VrmModel vrm={editorContext.threeGLTF.userData.vrm} />
      ) : (
        <VrmModel vrm={defaultVRMGLTF.userData.vrm} />
      )}
    </Canvas>
  );
}
