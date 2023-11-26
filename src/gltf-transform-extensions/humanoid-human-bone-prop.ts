import { IProperty, Nullable, Property } from "@gltf-transform/core";
import { PropertyType as VRMPropertyType } from "./constants.ts";

export interface IHumanoidHumanBoneProp extends IProperty {
  node: Node;
}

export class HumanoidHumanBoneProp extends Property<IHumanoidHumanBoneProp> {
  public declare propertyType: VRMPropertyType.HUMANOID_HUMAN_BONE;

  protected init(): void {
    this.propertyType = VRMPropertyType.HUMANOID_HUMAN_BONE;
  }

  protected getDefaults(): Nullable<IHumanoidHumanBoneProp> {
    return Object.assign(super.getDefaults() as IProperty, {
      node: null,
    });
  }
}
