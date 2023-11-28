import { Document, Material, NodeIO, VertexLayout } from "@gltf-transform/core";
// VRM0
import * as VRM0_CONSTANTS from "../gltf-transform-extensions/VRM0/constants.ts";
import VRM0Prop from "../gltf-transform-extensions/VRM0/properties/vrm0-vrm-prop.ts";
// VRM0Prop
import * as VRM1_CONSTANTS from "../gltf-transform-extensions/VRM1/constants.ts";

import {
  KHRMaterialsUnlit,
  KHRTextureTransform,
} from "@gltf-transform/extensions";

// VRM0 Extensions
import VRM0VRM from "../gltf-transform-extensions/VRM0/vrm0-vrm.ts";

// VRM1 Extensions
import VRM1VRM from "../gltf-transform-extensions/VRM1/vrm1-vrm.ts";
import VRMC_materials_mtoon from "../gltf-transform-extensions/VRM1/vrm1-materials-mtoon.ts";
import VRMC_springBone from "../gltf-transform-extensions/VRM1/vrm1-springbone.ts";

// VRM Extension Props
import { MaterialMToonProp } from "../gltf-transform-extensions/material-mtoon-prop.ts";

export class GLTFTransformExtensionUtils {
  public static isVRM0Document(document: Document): boolean {
    return document
      .getRoot()
      .listExtensionsUsed()
      .some((extension) => extension.extensionName === VRM0_CONSTANTS.VRM0);
  }

  public static getVRM0Extension(document: Document): VRM0Prop | null {
    return document.getRoot().getExtension<VRM0Prop>(VRM0_CONSTANTS.VRM0);
  }

  public static getMaterialMToonPropByMaterialIndex(
    document: Document,
    index: number
  ): MaterialMToonProp | null {
    if (GLTFTransformExtensionUtils.isVRM0Document(document)) {
      return (
        document
          ?.getRoot()
          ?.listMaterials()
          ?.at(index!)
          ?.getExtension<MaterialMToonProp>(VRM0_CONSTANTS.VRM0) || null
      );
    } else {
      return (
        document
          ?.getRoot()
          ?.listMaterials()
          ?.at(index!)
          ?.getExtension<MaterialMToonProp>(
            VRM1_CONSTANTS.VRMC_MATERIALS_MTOON
          ) || null
      );
    }
  }

  public static listVRM0MaterialMToons(
    document: Document
  ): (MaterialMToonProp | null)[] {
    return document
      .getRoot()
      .listMaterials()
      .map((material) =>
        material.getExtension<MaterialMToonProp>(VRM0_CONSTANTS.VRM0)
      );
  }

  public static getVRM1MaterialExtension(
    material: Material
  ): MaterialMToonProp | null {
    const materialMToon = material.getExtension<MaterialMToonProp>(
      VRM1_CONSTANTS.VRMC_MATERIALS_MTOON
    );

    return materialMToon;
  }

  public static getVRM0NodeIO(): NodeIO {
    const nodeIO = new NodeIO().setVertexLayout(VertexLayout.SEPARATE);
    nodeIO.registerExtensions([
      VRM0VRM,
      KHRMaterialsUnlit,
      KHRTextureTransform,
    ]);

    return nodeIO;
  }

  public static getVRM1NodeIO(): NodeIO {
    const nodeIO = new NodeIO().setVertexLayout(VertexLayout.SEPARATE);
    nodeIO.registerExtensions([
      VRM1VRM,
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
