import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import VRM0_vrm from "../gltf-transform-extensions/VRM0/VRM0_vrm.ts";
import {
  KHRMaterialsUnlit,
  KHRTextureTransform,
} from "@gltf-transform/extensions";
import VRMC_materials_mtoon from "../gltf-transform-extensions/VRM1/VRMC_materials_mtoon.ts";
import VRMC_vrm from "../gltf-transform-extensions/VRM1/VRMC_vrm.ts";
import VRMC_springBone from "../gltf-transform-extensions/VRM1/VRMC_springBone.ts";
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
    VRMUtils.rotateVRM0(gltf.userData.vrm);

    return gltf;
  }

  public static async readVRMGLTFDocument(file: File): Promise<Document> {
    const vrm0NodeIO = new NodeIO().registerExtensions([
      VRM0_vrm,
      KHRMaterialsUnlit,
      KHRTextureTransform,
    ]);
    const arrayBuffer = new Uint8Array(await file.arrayBuffer());
    let document = await vrm0NodeIO.readBinary(arrayBuffer);
    const documentIsVRM0 = GLTFTransformExtensionUtils.isVRM0Document(document);
    if (!documentIsVRM0) {
      console.info("READING AS VRM1");
      const vrmNodeIO = new NodeIO().registerExtensions([
        VRMC_vrm,
        VRMC_materials_mtoon,
        VRMC_springBone,
        KHRMaterialsUnlit,
        KHRTextureTransform,
      ]);
      document = await vrmNodeIO.readBinary(arrayBuffer);
    }
    return document;
  }
}
