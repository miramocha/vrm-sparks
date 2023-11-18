import {
  Extension,
  ExtensionProperty,
  PropertyType,
} from "@gltf-transform/core";
import { UNIVRM } from "../constants.ts";

const NAME = UNIVRM;

export default class VRM extends Extension {
  public readonly extensionName = NAME;
  public static readonly EXTENSION_NAME = NAME;

  public read(): this {
    this.document
      .getRoot()
      .setExtension(NAME, new VRMRoot(this.document.getGraph()));
    return this;
  }

  public write(): this {
    return this;
  }
}

export class VRMRoot extends ExtensionProperty {
  public static EXTENSION_NAME = UNIVRM;
  public declare extensionName: typeof UNIVRM;
  public declare propertyType: "Vrm";
  public declare parentTypes: [PropertyType.ROOT];

  protected init(): void {
    this.extensionName = UNIVRM;
    this.propertyType = "Vrm";
    this.parentTypes = [PropertyType.ROOT];
  }
}
