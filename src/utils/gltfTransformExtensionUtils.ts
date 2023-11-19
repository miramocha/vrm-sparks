import { Document, Material } from "@gltf-transform/core";
// VRM0
import * as VRM0_CONSTANTS from "../gltf-transform-extensions/VRM0/constants.ts";
import VRM from "../gltf-transform-extensions/VRM0/VRM.ts";
// VRM
import * as VRM_CONSTANTS from "../gltf-transform-extensions/VRM1/constants.ts";
import MaterialMToon from "../gltf-transform-extensions/VRM1/materialMToon.ts";

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
}
