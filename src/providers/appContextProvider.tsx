import { useContext, createContext, ReactElement, useState } from "react";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRM, VRMUtils } from "@pixiv/three-vrm";
import { Document as GLTFDocument, NodeIO } from "@gltf-transform/core";
import { AnimationMixer } from "three";
import { LoaderUtils } from "../utils/LoaderUtils.ts";
import { GLTFTransformExtensionUtils } from "../utils/GLTFTransformExtensionUtils.ts";
import VRM0_vrm from "../gltf-transform-extensions/VRM0/VRM0_vrm.ts";
import {
  KHRMaterialsUnlit,
  KHRTextureTransform,
} from "@gltf-transform/extensions";

type GetContextState<T> = () => T | null;

export class AppContextController {
  async reloadGLTFDocument(): Promise<File | null> {
    if (this.gltfDocument) {
      const nodeIO = new NodeIO();

      if (GLTFTransformExtensionUtils.isVRM0Document(this.gltfDocument)) {
        nodeIO.registerExtensions([
          KHRMaterialsUnlit,
          KHRTextureTransform,
          VRM0_vrm,
        ]);
      }

      const fileBuffer = await nodeIO.writeBinary(this.gltfDocument);
      const file = new File([fileBuffer], "exportedVrm.vrm");
      console.log("NEW FILE BUILT", file);
      this.vrmGLTF = await LoaderUtils.loadThreeVRM(file);

      return file;
    }

    return null;
  }

  // GLTF Document
  getGLTFDocument: GetContextState<GLTFDocument> | undefined;
  setGLTFDocument: React.Dispatch<GLTFDocument> | undefined;
  get gltfDocument(): GLTFDocument | null {
    if (this.getGLTFDocument) {
      return this.getGLTFDocument();
    }

    return null;
  }
  set gltfDocument(gltfDocument: GLTFDocument) {
    if (this.setGLTFDocument) {
      this.setGLTFDocument(gltfDocument);
    }
  }

  // VRMs Props
  getVRMGLTF: GetContextState<GLTF> | undefined;
  setVRMGLTF: React.Dispatch<GLTF> | undefined;
  get vrmGLTF(): GLTF | null {
    if (this.getVRMGLTF) {
      return this.getVRMGLTF();
    }

    return null;
  }
  set vrmGLTF(vrmGLTF: GLTF) {
    if (this.vrmGLTF) {
      console.log("DISPOSING GLTF", vrmGLTF.userData.vrm);
      VRMUtils.deepDispose(this.vrmGLTF.scene);
    }

    console.log("SETTING GLTF", vrmGLTF);

    if (vrmGLTF && vrmGLTF?.userData.vrm) {
      VRMUtils.removeUnnecessaryVertices(vrmGLTF.scene);
      VRMUtils.removeUnnecessaryJoints(vrmGLTF.scene);

      const vrm: VRM = vrmGLTF.userData.vrm;
      if (vrm) {
        VRMUtils.rotateVRM0(vrm);
      }
    }

    if (this.setVRMGLTF) {
      this.setVRMGLTF(vrmGLTF);
    }
  }

  // Animation Mixer
  getMainAnimationMixer: GetContextState<AnimationMixer> | undefined;
  setMainAnimationMixer: React.Dispatch<AnimationMixer> | undefined;
  get mainAnimationMixer(): AnimationMixer | null {
    if (this.getMainAnimationMixer) {
      return this.getMainAnimationMixer();
    }

    return null;
  }
  set mainAnimationMixer(mainAnimationMixer) {
    if (mainAnimationMixer) {
      mainAnimationMixer.timeScale = 1.0;

      if (this.setMainAnimationMixer) {
        this.setMainAnimationMixer(mainAnimationMixer);
      }
    }
  }
}

export const AppContext = createContext(new AppContextController());

type AppContextProviderProps = {
  children: ReactElement;
};
export default function AppContextProvider({
  children,
}: AppContextProviderProps) {
  const appContext: AppContextController = useContext(AppContext);
  const [gltfDocument, setGLTFDocument] = useState<GLTFDocument | null>(null);

  appContext.getGLTFDocument = () => gltfDocument;
  appContext.setGLTFDocument = setGLTFDocument;

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
}
