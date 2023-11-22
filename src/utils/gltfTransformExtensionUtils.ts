import { Document, Material, NodeIO } from "@gltf-transform/core";
// VRM0
import * as VRM0_CONSTANTS from "../gltf-transform-extensions/VRM0/constants.ts";
import VRM from "../gltf-transform-extensions/VRM0/VRM.ts";
// VRM
import * as VRM_CONSTANTS from "../gltf-transform-extensions/VRM1/constants.ts";
import MaterialMToon from "../gltf-transform-extensions/VRM1/materialMToon.ts";
import VRM0_vrm from "../gltf-transform-extensions/VRM0/VRM0_vrm.ts";
import {
  KHRMaterialsUnlit,
  KHRTextureTransform,
} from "@gltf-transform/extensions";
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
    const vrm = document.getRoot().getExtension<VRM>(VRM0_CONSTANTS.VRM0);

    return vrm;
  }

  public static getVRMMaterialExtension(
    material: Material
  ): MaterialMToon | null {
    const materialMToon = material.getExtension<MaterialMToon>(
      VRM_CONSTANTS.VRMC_MATERIALS_MTOON
    );

    return materialMToon;
  }

  public static registerVRM0Extensions(nodeIO: NodeIO): NodeIO {
    return nodeIO.registerExtensions([
      VRM0_vrm,
      KHRMaterialsUnlit,
      KHRTextureTransform,
    ]);
  }

  public static registerVRM1Extensions(nodeIO: NodeIO): NodeIO {
    return nodeIO.registerExtensions([
      VRMC_vrm,
      VRMC_materials_mtoon,
      VRMC_springBone,
      KHRMaterialsUnlit,
      KHRTextureTransform,
    ]);
  }

  public static async writeVRMGLTFDocumentToFile(
    document: Document,
    fileName: string
  ): Promise<File> {
    const nodeIO = new NodeIO();
    if (GLTFTransformExtensionUtils.isVRM0Document(document)) {
      GLTFTransformExtensionUtils.registerVRM0Extensions(nodeIO);
    } else {
      GLTFTransformExtensionUtils.registerVRM1Extensions(nodeIO);
    }

    const fileBuffer = await nodeIO.writeBinary(document);
    const file = new File([fileBuffer], `${fileName}.vrm`);

    return file;
  }

  public static async readVRMGLTFDocumentFromFile(
    file: File
  ): Promise<Document> {
    const vrm0NodeIO = GLTFTransformExtensionUtils.registerVRM0Extensions(
      new NodeIO()
    );
    const arrayBuffer = new Uint8Array(await file.arrayBuffer());
    let document = await vrm0NodeIO.readBinary(arrayBuffer);

    if (GLTFTransformExtensionUtils.isVRM0Document(document)) {
      const vrm1NodeIO = GLTFTransformExtensionUtils.registerVRM1Extensions(
        new NodeIO()
      );

      document = await vrm1NodeIO.readBinary(arrayBuffer);
    }

    return document;
  }
}
