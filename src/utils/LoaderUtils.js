import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";

import { NodeIO, Document } from "@gltf-transform/core";
import {
  KHRMaterialsUnlit,
  KHRTextureTransform,
} from "@gltf-transform/extensions";

import VRM_vrm from "../gltf-transform-extensions/UniVRM/VRM_vrm.ts";
import VRMC_vrm from "../gltf-transform-extensions/VRM/VRMC_vrm.ts";
import VRMC_materials_mtoon from "../gltf-transform-extensions/VRM/VRMC_materials_mtoon.ts";
import VRMC_springBone from "../gltf-transform-extensions/VRM/VRMC_springBone.ts";

import * as UNIVRM_CONSTANTS from "../gltf-transform-extensions/UniVRM/constants.ts";
import VRM from "../gltf-transform-extensions/UniVRM/VRM.ts";
import GLTFTransformExtensionUtils from "./GltfTransformExtensionUtils.js";

export class LoaderUtils {
  public static async loadThreeVRM(file: File): Promise<GLTF> {
    const loader = new GLTFLoader();
    loader.register((parser) => {
      return new VRMLoaderPlugin(parser, { autoUpdateHumanBones: true });
    });
    const objectUrl = URL.createObjectURL(file);

    return await loader.loadAsync(objectUrl);
  }

  public static async readVRMGLTFDocument(file: File): Promise<Document> {
    const uniVRMNodeIO = new NodeIO().registerExtensions([
      VRM_vrm,
      KHRMaterialsUnlit,
      KHRTextureTransform,
    ]);
    const arrayBuffer = new Uint8Array(await file.arrayBuffer());
    let document = await uniVRMNodeIO.readBinary(arrayBuffer);

    const documentIsUniVRM =
      GLTFTransformExtensionUtils.isUniVRMDocument(document);

    if (documentIsUniVRM) {
      const uniVRMRoot = document
        .getRoot()
        .getExtension<VRM>(UNIVRM_CONSTANTS.UNIVRM);

      console.log("UNIVRM MATS:", uniVRMRoot?.getMaterialProperties());
    } else {
      const vrmNodeIO = new NodeIO().registerExtensions([
        VRMC_vrm,
        VRMC_materials_mtoon,
        VRMC_springBone,
        KHRMaterialsUnlit,
        KHRTextureTransform,
      ]);

      document = await vrmNodeIO.readBinary(arrayBuffer);
      console.log("VRM Extensions:", document.getRoot().listExtensionsUsed());
    }

    return document;
  }
}
