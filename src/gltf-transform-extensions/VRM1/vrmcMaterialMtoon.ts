import { PropertyType } from "@gltf-transform/core";
import MaterialMToon from "../materialMtoon.ts";
import { VRMC_MATERIALS_MTOON } from "./constants.ts";

const NAME = VRMC_MATERIALS_MTOON;

export default class VRMCMaterialMToon extends MaterialMToon {
  public static EXTENSION_NAME = NAME;
  public declare extensionName: typeof NAME;
  public declare propertyType: "VRMC_MaterialsMToon";
  public declare parentTypes: [PropertyType.MATERIAL];

  protected init(): void {
    this.extensionName = NAME;
    this.propertyType = "VRMC_MaterialsMToon";
    this.parentTypes = [PropertyType.MATERIAL];
  }
}
