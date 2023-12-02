import { IProperty, Nullable, Property } from "@gltf-transform/core";

import { PropertyType as VRMPropertyType } from "../../constants.ts";
import { MorphTargetBindProp } from "./morph-target-bind-prop.ts";

type ExpressionOverrideType = "none" | "block" | "blend";

export interface IExpressionProp extends IProperty {
  morphTargetBindProps: MorphTargetBindProp[];
  isBinary: boolean;
  overrideBlink: ExpressionOverrideType;
  overrideMouth: ExpressionOverrideType;
  overrideLookAt: ExpressionOverrideType;
}

export class ExpressionProp extends Property<IExpressionProp> {
  public declare propertyType: VRMPropertyType.EXPRESSIONS_EXPRESSION_PROP;

  protected init(): void {
    this.propertyType = VRMPropertyType.EXPRESSIONS_EXPRESSION_PROP;
  }

  protected getDefaults(): Nullable<IExpressionProp> {
    return Object.assign(super.getDefaults() as IProperty, {
      morphTargetBindProps: [],
      isBinary: true,
      overrideBlink: "none" as ExpressionOverrideType,
      overrideMouth: "none" as ExpressionOverrideType,
      overrideLookAt: "none" as ExpressionOverrideType,
    });
  }
}
