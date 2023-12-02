import { IProperty, Nullable, Property } from "@gltf-transform/core";
import * as VRM1Type from "@pixiv/types-vrmc-vrm-1.0";
import { PropertyType as VRMPropertyType } from "../../constants.ts";
import { ExpressionProp } from "./expression-prop.ts";

export interface IExpressionsProp extends IProperty {
  presetExpressionProps: {
    [key in VRM1Type.ExpressionPresetName]: ExpressionProp;
  };
  customExpressionProps: { [key: string]: ExpressionProp };
}

export class ExpressionsProp extends Property<IExpressionsProp> {
  public declare propertyType: VRMPropertyType.EXPRESSIONS_PROP;

  protected init(): void {
    this.propertyType = VRMPropertyType.EXPRESSIONS_PROP;
  }

  protected getDefaults(): Nullable<IExpressionsProp> {
    return Object.assign(super.getDefaults() as IProperty, {
      presetExpressionProps: {} as {
        [key in VRM1Type.ExpressionPresetName]: ExpressionProp;
      },
      customExpressionProps: {} as { [key: string]: ExpressionProp },
    });
  }

  public getPresetExpressionProp(
    key: VRM1Type.ExpressionPresetName
  ): ExpressionProp | null {
    return this.getRefMap("presetExpressionProps", key);
  }
  public setPresetExpressionProp(
    key: VRM1Type.ExpressionPresetName,
    expressionProp: ExpressionProp
  ): this {
    return this.setRefMap("presetExpressionProps", key, expressionProp);
  }

  public getCustomExpressionProp(key: string): ExpressionProp | null {
    return this.getRefMap("customExpressionProps", key);
  }
  public setCustomExpressionProp(
    key: string,
    expressionProp: ExpressionProp
  ): this {
    return this.setRefMap("customExpressionProps", key, expressionProp);
  }
}
