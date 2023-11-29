import { IProperty, Nullable, Property, Node } from "@gltf-transform/core";
import { PropertyType as VRMPropertyType } from "../../constants.ts";

export interface IHumanBoneProp extends IProperty {
  node: Node;
}

export class HumanBoneProp extends Property<IHumanBoneProp> {
  public declare propertyType: VRMPropertyType.HUMANOID_HUMAN_BONE_PROP;

  protected init(): void {
    this.propertyType = VRMPropertyType.HUMANOID_HUMAN_BONE_PROP;
  }

  protected getDefaults(): Nullable<IHumanBoneProp> {
    return Object.assign(super.getDefaults() as IProperty, {
      node: null,
    });
  }

  public getNode(): Node | null {
    return this.getRef("node");
  }
  public setNode(node: Node | null): this {
    return this.setRef("node", node);
  }
}
