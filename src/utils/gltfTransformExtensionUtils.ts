import { Document, Material, NodeIO } from "@gltf-transform/core";
// VRM0
import * as VRM0_CONSTANTS from "../gltf-transform-extensions/VRM0/constants.ts";
import VRM from "../gltf-transform-extensions/VRM0/VRM.ts";
// VRM
import * as VRM1_CONSTANTS from "../gltf-transform-extensions/VRM1/constants.ts";

import {
  KHRMaterialsUnlit,
  KHRTextureTransform,
} from "@gltf-transform/extensions";

import VRM0_vrm from "../gltf-transform-extensions/VRM0/VRM0_vrm.ts";
import MaterialMToon from "../gltf-transform-extensions/materialMtoon.ts";

import VRMC_vrm from "../gltf-transform-extensions/VRM1/VRMC_vrm.ts";
import VRMC_materials_mtoon from "../gltf-transform-extensions/VRM1/VRMC_materials_mtoon.ts";
import VRMC_springBone from "../gltf-transform-extensions/VRM1/VRMC_springBone.ts";

export class GLTFTransformExtensionUtils {
  public static isVRM0Document(document: Document): boolean {
    return document
      .getRoot()
      .listExtensionsUsed()
      .some((extension) => extension.extensionName === VRM0_CONSTANTS.VRM0);
  }

  public static getVRM0Extension(document: Document): VRM | null {
    return document.getRoot().getExtension<VRM>(VRM0_CONSTANTS.VRM0);
  }

  public static getMaterialMToonByMaterialIndex(
    document: Document,
    index: number
  ): MaterialMToon | null {
    if (GLTFTransformExtensionUtils.isVRM0Document(document)) {
      return (
        document
          ?.getRoot()
          ?.listMaterials()
          ?.at(index!)
          ?.getExtension<MaterialMToon>(VRM0_CONSTANTS.VRM0) || null
      );
    } else {
      return (
        document
          ?.getRoot()
          ?.listMaterials()
          ?.at(index!)
          ?.getExtension<MaterialMToon>(VRM1_CONSTANTS.VRMC_MATERIALS_MTOON) ||
        null
      );
    }
  }

  public static listVRM0MaterialMToons(
    document: Document
  ): (MaterialMToon | null)[] {
    return document
      .getRoot()
      .listMaterials()
      .map((material) =>
        material.getExtension<MaterialMToon>(VRM0_CONSTANTS.VRM0)
      );
  }

  public static getVRM1MaterialExtension(
    material: Material
  ): MaterialMToon | null {
    const materialMToon = material.getExtension<MaterialMToon>(
      VRM1_CONSTANTS.VRMC_MATERIALS_MTOON
    );

    return materialMToon;
  }

  public static getVRM0NodeIO(): NodeIO {
    const nodeIO = new NodeIO();
    nodeIO.registerExtensions([
      VRM0_vrm,
      KHRMaterialsUnlit,
      KHRTextureTransform,
    ]);

    return nodeIO;
  }

  public static getVRM1NodeIO(): NodeIO {
    const nodeIO = new NodeIO();
    nodeIO.registerExtensions([
      VRMC_vrm,
      VRMC_materials_mtoon,
      VRMC_springBone,
      KHRMaterialsUnlit,
      KHRTextureTransform,
    ]);

    return nodeIO;
  }

  public static async writeVRMGLTFDocumentToFile(
    document: Document,
    fileName: string
  ): Promise<File> {
    if (GLTFTransformExtensionUtils.isVRM0Document(document)) {
      return new File(
        [
          await GLTFTransformExtensionUtils.getVRM0NodeIO().writeBinary(
            document
          ),
        ],
        `${fileName}`
      );
    } else {
      return new File(
        [
          await GLTFTransformExtensionUtils.getVRM1NodeIO().writeBinary(
            document
          ),
        ],
        `${fileName}`
      );
    }
  }

  public static async readVRMGLTFDocumentFromFile(
    file: File
  ): Promise<Document> {
    const arrayBuffer = new Uint8Array(await file.arrayBuffer());
    let document = await GLTFTransformExtensionUtils.getVRM0NodeIO().readBinary(
      arrayBuffer
    );
    const documentIsVRM0 = GLTFTransformExtensionUtils.isVRM0Document(document);
    if (!documentIsVRM0) {
      document =
        await await GLTFTransformExtensionUtils.getVRM1NodeIO().readBinary(
          arrayBuffer
        );
    }
    return document;
  }
}
