import { IProperty, Nullable, Property } from "@gltf-transform/core";
import * as VRM1Def from "@pixiv/types-vrmc-vrm-1.0";
import { HumanoidHumanBoneProp } from "./humanoid-human-bone-prop.ts";
import { PropertyType as VRMPropertyType } from "./constants.ts";

export interface IHumanoidProp extends IProperty {
  humanoidHumanBonePropMap: {
    [key: string]: HumanoidHumanBoneProp;
  };
}

export class HumanoidProp extends Property<IHumanoidProp> {
  public declare propertyType: VRMPropertyType.HUMANOID_PROP;

  protected init(): void {
    this.propertyType = VRMPropertyType.HUMANOID_PROP;
  }

  protected getDefaults(): Nullable<IHumanoidProp> {
    return Object.assign(super.getDefaults() as IProperty, {
      humanoidHumanBonePropMap: {},
    });
  }

  public getHumanoidHumanBoneProp(
    humanoidHumanBoneName: VRM1Def.HumanoidHumanBoneName
  ): HumanoidHumanBoneProp | null {
    return this.getRefMap(
      "humanoidHumanBonePropMap",
      humanoidHumanBoneName as VRM1Def.HumanoidHumanBoneName
    );
  }

  public setHumanoidHumanBoneProp(
    humanoidHumanBoneName: VRM1Def.HumanoidHumanBoneName,
    humanoidHumanBoneProp: HumanoidHumanBoneProp
  ): this {
    return this.setRefMap(
      "humanoidHumanBonePropMap",
      humanoidHumanBoneName,
      humanoidHumanBoneProp
    );
  }
}
