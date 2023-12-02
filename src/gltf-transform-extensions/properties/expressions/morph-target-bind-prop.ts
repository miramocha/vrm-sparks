import { IProperty, Nullable, Property, Node } from "@gltf-transform/core";

import { PropertyType as VRMPropertyType } from "../../constants.ts";

export interface IMorphTargetBindProp extends IProperty {
  targetNode: Node;
  targetMorph: Node; // Node?
  weight: number;
}

export class MorphTargetBindProp extends Property<IMorphTargetBindProp> {
  public declare propertyType: VRMPropertyType.EXPRESSIONS_MORPH_TARGET_BIND_PROP;

  protected init(): void {
    this.propertyType = VRMPropertyType.EXPRESSIONS_MORPH_TARGET_BIND_PROP;
  }

  protected getDefaults(): Nullable<IMorphTargetBindProp> {
    return Object.assign(super.getDefaults() as IProperty, {
      targetNode: null,
      targetMorph: null,
      weight: 1.0,
    });
  }
}
