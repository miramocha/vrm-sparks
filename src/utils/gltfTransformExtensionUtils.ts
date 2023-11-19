import { Document, Material } from "@gltf-transform/core";
// UniVRM
import * as UNIVRM_CONSTANTS from "../gltf-transform-extensions/UniVRM/constants.ts";
import VRM from "../gltf-transform-extensions/UniVRM/VRM.ts";
// VRM
import * as VRM_CONSTANTS from "../gltf-transform-extensions/VRM/constants.ts";
import MaterialMToon from "../gltf-transform-extensions/VRM/materialMToon.ts";

export class GLTFTransformExtensionUtils {
  public static isUniVRMDocument(document: Document): boolean {
    return document
      .getRoot()
      .listExtensionsUsed()
      .some((extension) => extension.extensionName === UNIVRM_CONSTANTS.UNIVRM);
  }

  public static getUniVRMExtension(document: Document): VRM | null {
    const vrm = document
      .getRoot()
      .getExtension<VRM>(VRM_CONSTANTS.VRMC_MATERIALS_MTOON);

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
