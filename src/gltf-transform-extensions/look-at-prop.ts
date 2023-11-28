import { IProperty, Nullable, Property } from "@gltf-transform/core";
import { PropertyType as VRMPropertyType } from "./constants.ts";

export interface ILookAtProp extends IProperty {}

export class LookAtProp extends Property<ILookAtProp> {
  public declare propertyType: VRMPropertyType.LOOK_AT_PROP;

  protected init(): void {
    this.propertyType = VRMPropertyType.LOOK_AT_PROP;
  }

  protected getDefaults(): Nullable<ILookAtProp> {
    return Object.assign(super.getDefaults() as IProperty, {});
  }
}
