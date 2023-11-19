import { Document } from "@gltf-transform/core";
import * as UniVRMType from "@pixiv/types-vrm-0.0";
import * as UNIVRM_CONSTANTS from "../gltf-transform-extensions/UniVRM/constants.js";

export default class GLTFTransformExtensionUtils {
  public static isUniVRMDocument(document: Document): boolean {
    return document
      .getRoot()
      .listExtensionsUsed()
      .some((extension) => extension.extensionName === UNIVRM_CONSTANTS.UNIVRM);
  }

  public static getUniVRMDocumentMaterials() {}
}
