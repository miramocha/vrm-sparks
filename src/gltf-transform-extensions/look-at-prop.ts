import { IProperty, Nullable, Property } from "@gltf-transform/core";
import { HumanoidHumanBoneProp } from "./humanoid-human-bone-prop.ts";
import { PropertyType as VRMPropertyType } from "./constants.ts";

export interface IHumanoidProp extends IProperty {
  humanoidHumanBonePropMap: {
    [key: string]: HumanoidHumanBoneProp;
  };
}

export class HumanoidProp extends Property<IHumanoidProp> {
  public declare propertyType: VRMPropertyType.LOOK_AT_PROP;

  protected init(): void {
    this.propertyType = VRMPropertyType.LOOK_AT_PROP;
  }

  protected getDefaults(): Nullable<IHumanoidProp> {
    return Object.assign(super.getDefaults() as IProperty, {
      humanoidHumanBonePropMap: {},
    });
  }
}
