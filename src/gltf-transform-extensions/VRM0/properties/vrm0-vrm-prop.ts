import {
  ExtensionProperty,
  IProperty,
  Nullable,
  PropertyType,
  Node,
} from "@gltf-transform/core";
import * as VRM0Type from "@pixiv/types-vrm-0.0";
import { VRM0 as NAME } from "../constants.ts";
import { MetaProp } from "../../properties/meta-prop.ts";
import { HumanoidProp } from "../../properties/humanoid/humanoid-prop.ts";
import { FirstPersonProp } from "../../properties/first-person/first-person-prop.ts";
import { PropertyType as VRMPropertyType } from "../../constants.ts";
import { LookAtProp } from "../../properties/look-at/look-at-prop.ts";

interface IVRM0Prop extends IProperty {
  metaProp: MetaProp;
  //   specVersion?: "0.0";
  exporterVersion: string;
  humanoidProp: HumanoidProp;
  firstPersonProp: FirstPersonProp;
  lookAtProp: LookAtProp;
  firstPersonBoneNode: Node;
  lookAtHorizontalInnerCurve: number[];
  lookAtHorizontalOuterCurve: number[];
  lookAtVerticalDownCurve: number[];
  lookAtVerticalUpCurve: number[];

  serializedBlendShapeMaster: string;
  serializedSecondaryAnimation: string;
  serializedMaterialProperties: string;
}

export default class VRM0Prop extends ExtensionProperty<IVRM0Prop> {
  public static EXTENSION_NAME = NAME;
  public declare extensionName: typeof NAME;
  public declare propertyType: VRMPropertyType.VRM_PROP;
  public declare parentTypes: [PropertyType.ROOT];

  public readonly DEFAULT_FIRST_PERSON_CURVE: number[] = [
    0, 0, 0, 1, 1, 1, 1, 0,
  ];

  protected init(): void {
    this.extensionName = NAME;
    this.propertyType = VRMPropertyType.VRM_PROP;
    this.parentTypes = [PropertyType.ROOT];
  }

  protected getDefaults(): Nullable<IVRM0Prop> {
    return Object.assign(super.getDefaults() as IProperty, {
      metaProp: null,
      exporterVersion: "VRM Sparks 0.0",
      humanoidProp: null,
      firstPersonProp: null,
      lookAtProp: null,
      firstPersonBoneNode: null,
      lookAtHorizontalInnerCurve: this.DEFAULT_FIRST_PERSON_CURVE,
      lookAtHorizontalOuterCurve: this.DEFAULT_FIRST_PERSON_CURVE,
      lookAtVerticalDownCurve: this.DEFAULT_FIRST_PERSON_CURVE,
      lookAtVerticalUpCurve: this.DEFAULT_FIRST_PERSON_CURVE,

      serializedBlendShapeMaster: "{}",
      serializedSecondaryAnimation: "{}",
      serializedMaterialProperties: "[]",
    });
  }

  public setExporterVersion(exporterVersion: string): this {
    return this.set("exporterVersion", exporterVersion);
  }

  public getExporterVersion() {
    return this.get("exporterVersion");
  }

  public setMetaProp(meta: MetaProp): this {
    return this.setRef("metaProp", meta);
  }
  public getMetaProp(): MetaProp | null {
    return this.getRef("metaProp");
  }

  public setHumanoidProp(humanoidProp: HumanoidProp): this {
    return this.setRef("humanoidProp", humanoidProp);
  }
  public getHumanoidProp(): HumanoidProp | null {
    return this.getRef("humanoidProp");
  }

  public setFirstPersonProp(firstPersonProp: FirstPersonProp): this {
    return this.setRef("firstPersonProp", firstPersonProp);
  }
  public getFirstPersonProp(): FirstPersonProp | null {
    return this.getRef("firstPersonProp");
  }

  public setLookAtProp(lookAtProp: LookAtProp): this {
    return this.setRef("lookAtProp", lookAtProp);
  }
  public getLookAtProp(): LookAtProp | null {
    return this.getRef("lookAtProp");
  }

  public setBlendShapeMaster(blendShapeMaster: VRM0Type.BlendShape): this {
    return this.set(
      "serializedBlendShapeMaster",
      JSON.stringify(blendShapeMaster)
    );
  }

  public getBlendShapeMaster(): VRM0Type.BlendShape | undefined {
    const serializedBlendShapeMaster = this.get("serializedBlendShapeMaster");

    if (serializedBlendShapeMaster) {
      return JSON.parse(serializedBlendShapeMaster) as VRM0Type.BlendShape;
    }

    return undefined;
  }

  public setSecondaryAnimation(
    secondaryAnimation: VRM0Type.SecondaryAnimation
  ) {
    return this.set(
      "serializedSecondaryAnimation",
      JSON.stringify(secondaryAnimation)
    );
  }

  public getSecondaryAnimation(): VRM0Type.SecondaryAnimation | undefined {
    const serializedSecondaryAnimation = this.get(
      "serializedSecondaryAnimation"
    );

    if (serializedSecondaryAnimation) {
      return JSON.parse(
        serializedSecondaryAnimation
      ) as VRM0Type.SecondaryAnimation;
    }

    return undefined;
  }

  public setMaterialProperties(materialProperties: VRM0Type.Material[]): this {
    return this.set(
      "serializedMaterialProperties",
      JSON.stringify(materialProperties)
    );
  }

  public getMaterialProperties(): VRM0Type.Material[] | undefined {
    const serializedMaterialProperties = this.get(
      "serializedMaterialProperties"
    );

    if (serializedMaterialProperties) {
      return JSON.parse(serializedMaterialProperties) as VRM0Type.Material[];
    }

    return undefined;
  }

  /**********************************************************************************************
   * VRM0 Specifics
   */

  public setFirstPersonBoneNode(firstPersonBoneNode: Node): this {
    return this.setRef("firstPersonBoneNode", firstPersonBoneNode);
  }
  public getFirstPersonBoneNode() {
    return this.getRef("firstPersonBoneNode");
  }

  public getLookAtHorizontalInnerCurve(): number[] {
    return this.get("lookAtHorizontalInnerCurve");
  }
  public setLookAtHorizontalInnerCurve(lookAtCurve: number[]) {
    return this.set("lookAtHorizontalInnerCurve", lookAtCurve);
  }

  public getLookAtHorizontalOuterCurve(): number[] {
    return this.get("lookAtHorizontalOuterCurve");
  }
  public setLookAtHorizontalOuterCurve(lookAtCurve: number[]) {
    return this.set("lookAtHorizontalOuterCurve", lookAtCurve);
  }

  public getLookAtVerticalDownCurve(): number[] {
    return this.get("lookAtVerticalDownCurve");
  }
  public setLookAtVerticalDownCurve(lookAtCurve: number[]) {
    return this.set("lookAtVerticalDownCurve", lookAtCurve);
  }

  public getLookAtVerticalUpCurve(): number[] {
    return this.get("lookAtVerticalUpCurve");
  }
  public setLookAtVerticalUpCurve(lookAtCurve: number[]) {
    return this.set("lookAtVerticalUpCurve", lookAtCurve);
  }
}
