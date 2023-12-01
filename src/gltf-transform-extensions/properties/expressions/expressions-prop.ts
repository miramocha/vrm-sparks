import { IProperty, Nullable, Property } from "@gltf-transform/core";
import { PropertyType as VRMPropertyType } from "../../constants.ts";

export interface IExpressionsProp extends IProperty {}

export class ExpressionsProp extends Property<IExpressionsProp> {
  public declare propertyType: VRMPropertyType.EXPRESSIONS_PROP;

  protected init(): void {
    this.propertyType = VRMPropertyType.EXPRESSIONS_PROP;
  }

  protected getDefaults(): Nullable<IExpressionsProp> {
    return Object.assign(super.getDefaults() as IProperty, {});
  }
}
