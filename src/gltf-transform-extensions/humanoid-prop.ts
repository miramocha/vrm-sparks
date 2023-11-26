import {
  IProperty,
  Nullable,
  Property,
  Node,
  ExtensionProperty,
  PropertyType,
} from "@gltf-transform/core";
import * as VRM1Def from "@pixiv/types-vrmc-vrm-1.0";
import { PropertyType as VRMPropertyType } from "./constants.ts";
import { VRM0 as VRM0NAME } from "./VRM0/constants.ts";
import { VRMC_VRM as VRM1NAME } from "./VRM1/constants.ts";

export interface IHumanoidHumanBoneProp extends IProperty {
  node: Node;
}

export interface IHumanoidProp extends IProperty {
  humanBones: Map<VRM1Def.HumanoidHumanBoneName, IHumanoidHumanBoneProp>;
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

export class HumanoidProp extends ExtensionProperty<IHumanoidProp> {
  public declare extensionName: typeof VRM0NAME | typeof VRM1NAME;
  public declare propertyType: "VRMC_vrm.humanoid";
  public declare parentTypes: [PropertyType.ROOT];

  protected init(): void {
    this.extensionName = VRM1NAME;
    this.propertyType = "VRMC_vrm.humanoid";
    this.parentTypes = [PropertyType.ROOT];
  }

  protected getDefaults(): Nullable<IHumanoidProp> {
    return Object.assign(super.getDefaults() as IProperty, {
      humanBones: new Map<
        VRM1Def.HumanoidHumanBoneName,
        IHumanoidHumanBoneProp
      >(),
    });
  }

  public setHumanoidHumanBoneProp(
    humanoidHumanBoneName: VRM1Def.HumanoidHumanBoneName,
    humanoidHumanBoneProp: HumanoidHumanBoneProp
  ): this {
    return this.get("humanBones")?.set(
      humanoidHumanBoneName,
      humanoidHumanBoneProp
    );
  }
}

// humanBones: HumanoidHumanBones;
// extensions?: {
//     [name: string]: any;
// };
// extras?: any;
