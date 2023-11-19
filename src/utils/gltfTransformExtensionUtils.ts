import { Document } from "@gltf-transform/core";
// UniVRM
import * as UNIVRM_CONSTANTS from "../gltf-transform-extensions/UniVRM/constants.ts";
import VRM from "../gltf-transform-extensions/UniVRM/VRM.ts";

export class GLTFTransformExtensionUtils {
  public static isUniVRMDocument(document: Document): boolean {
    return document
      .getRoot()
      .listExtensionsUsed()
      .some((extension) => extension.extensionName === UNIVRM_CONSTANTS.UNIVRM);
  }

  public static getUniVRMExtensionProperties(document: Document): VRM | null {
    const vrm = document.getRoot().getExtension<VRM>(UNIVRM_CONSTANTS.UNIVRM);

    return vrm;
  }
}
