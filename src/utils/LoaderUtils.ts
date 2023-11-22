import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";

import { NodeIO, Document } from "@gltf-transform/core";

import { GLTFTransformExtensionUtils } from "./GLTFTransformExtensionUtils.ts";

export class LoaderUtils {
  public static async loadThreeVRM(file: File): Promise<GLTF> {
    const helperRoot = new THREE.Group();
    helperRoot.renderOrder = 10000;

    const loader = new GLTFLoader();
    loader.register((parser) => {
      return new VRMLoaderPlugin(parser, {
        autoUpdateHumanBones: true,
        helperRoot,
      });
    });
    const objectUrl = URL.createObjectURL(file);
    const gltf = await loader.loadAsync(objectUrl);

    return gltf;
  }
}
