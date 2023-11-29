import { IProperty, Nullable, Property } from "@gltf-transform/core";
import * as VRM1Type from "@pixiv/types-vrmc-vrm-1.0";
import { HumanBoneProp } from "./human-bone-prop.ts";
import { PropertyType as VRMPropertyType } from "../../constants.ts";

export interface IHumanoidProp extends IProperty {
  humanBonePropMap: {
    [key: string]: HumanBoneProp;
  };
}

export class HumanoidProp extends Property<IHumanoidProp> {
  public declare propertyType: VRMPropertyType.HUMANOID_PROP;

  protected init(): void {
    this.propertyType = VRMPropertyType.HUMANOID_PROP;
  }

  protected getDefaults(): Nullable<IHumanoidProp> {
    return Object.assign(super.getDefaults() as IProperty, {
      humanBonePropMap: {},
    });
  }

  public getHumanBoneProp(
    humanoidHumanBoneName: VRM1Type.HumanoidHumanBoneName
  ): HumanBoneProp | null {
    return this.getRefMap(
      "humanBonePropMap",
      humanoidHumanBoneName as VRM1Type.HumanoidHumanBoneName
    );
  }

  public setHumanBoneProp(
    humanoidHumanBoneName: VRM1Type.HumanoidHumanBoneName,
    humanBoneProp: HumanBoneProp
  ): this {
    return this.setRefMap(
      "humanBonePropMap",
      humanoidHumanBoneName,
      humanBoneProp
    );
  }
}
