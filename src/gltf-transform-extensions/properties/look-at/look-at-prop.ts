import { IProperty, Nullable, Property, vec3 } from "@gltf-transform/core";
import {
  PropertyType as VRMPropertyType,
  LookAtType,
  RangeMap,
} from "../../constants.ts";

export interface ILookAtProp extends IProperty {
  offsetFromHeadBone: vec3;
  rangeMapHorizontalInner: RangeMap;
  rangeMapHorizontalOuter: RangeMap;
  rangeMapVerticalDown: RangeMap;
  rangeMapVerticalUp: RangeMap;
  type: LookAtType;
}

export class LookAtProp extends Property<ILookAtProp> {
  public declare propertyType: VRMPropertyType.LOOK_AT_PROP;

  protected init(): void {
    this.propertyType = VRMPropertyType.LOOK_AT_PROP;
  }

  protected getDefaults(): Nullable<ILookAtProp> {
    return Object.assign(super.getDefaults() as IProperty, {
      offsetFromHeadBone: [0.0, 0.06, 0.0] as vec3,
      rangeMapHorizontalInner: {
        inputMaxValue: 90,
        outputScale: 10.0,
      } as RangeMap,
      rangeMapHorizontalOuter: {
        inputMaxValue: 90,
        outputScale: 10.0,
      } as RangeMap,
      rangeMapVerticalDown: {
        inputMaxValue: 90,
        outputScale: 10.0,
      } as RangeMap,
      rangeMapVerticalUp: { inputMaxValue: 90, outputScale: 10.0 } as RangeMap,
      type: "bone" as LookAtType,
    });
  }

  public getOffsetFromHeadBone(): vec3 {
    return this.get("offsetFromHeadBone");
  }
  public setOffsetFromHeadBone(offsetFromHeadBone: vec3) {
    return this.set("offsetFromHeadBone", offsetFromHeadBone);
  }

  public getRangeMapHorizontalInner(): RangeMap {
    return this.get("rangeMapHorizontalInner");
  }
  public setRangeMapHorizontalInner(rangeMap: RangeMap): this {
    return this.set("rangeMapHorizontalInner", rangeMap);
  }

  public getRangeMapHorizontalOuter(): RangeMap {
    return this.get("rangeMapHorizontalOuter");
  }
  public setRangeMapHorizontalOuter(rangeMap: RangeMap): this {
    return this.set("rangeMapHorizontalOuter", rangeMap);
  }

  public getRangeMapVerticalDown(): RangeMap {
    return this.get("rangeMapVerticalDown");
  }
  public setRangeMapVerticalDown(rangeMap: RangeMap) {
    return this.set("rangeMapVerticalDown", rangeMap);
  }

  public getRangeMapVerticalUp(): RangeMap {
    return this.get("rangeMapVerticalUp");
  }
  public setRangeMapVerticalUp(rangeMap: RangeMap) {
    return this.set("rangeMapVerticalUp", rangeMap);
  }

  public getType(): LookAtType {
    return this.get("type");
  }
  public setType(type: LookAtType) {
    return this.set("type", type);
  }
}
