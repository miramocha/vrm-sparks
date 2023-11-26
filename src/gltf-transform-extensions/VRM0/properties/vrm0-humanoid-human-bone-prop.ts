import { PropertyType } from "@gltf-transform/core";
import { VRM0 as NAME } from "../constants.ts";
import { HumanoidHumanBoneProp } from "../../humanoid-human-bone-prop.ts";

export default class VRM0HumanoidProp extends HumanoidHumanBoneProp {
  protected init(): void {
    this.propertyType = "VRMC_vrm.humanoid.humanBone";
  }
}
