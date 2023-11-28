import { PropertyType } from "@gltf-transform/core";
import { MaterialMToonProp } from "../../material-mtoon-prop.ts";
import { VRMC_MATERIALS_MTOON as NAME } from "../constants.ts";
import { PropertyType as VRMPropertyType } from "../../constants.ts";

export default class VRM1MaterialMToon extends MaterialMToonProp {
  public static EXTENSION_NAME = NAME;
  public declare extensionName: typeof NAME;
  public declare propertyType: VRMPropertyType.MATERIAL_MTOON_PROP;
  public declare parentTypes: [PropertyType.MATERIAL];

  protected init(): void {
    this.extensionName = NAME;
    this.propertyType = VRMPropertyType.MATERIAL_MTOON_PROP;
    this.parentTypes = [PropertyType.MATERIAL];
  }
}
