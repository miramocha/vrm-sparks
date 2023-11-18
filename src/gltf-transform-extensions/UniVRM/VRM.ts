import {
  ExtensionProperty,
  IProperty,
  PropertyType,
} from "@gltf-transform/core";
import * as VRMType from "@pixiv/types-vrm-0.0";
import { UNIVRM } from "./constants.ts";

interface IVRM extends IProperty {
  //   specVersion?: "0.0";
  exporterVersion: string;
  metaJSONString: string;
  humanoidJSONString: string;
  firstPersonJSONString: string;
  blendShapeMasterJSONString: string;
  secondaryAnimationJSONString: string;
  materialPropertiesJSONString: string;
}

export default class VRM extends ExtensionProperty<IVRM> {
  public static EXTENSION_NAME = UNIVRM;
  public declare extensionName: typeof UNIVRM;
  public declare propertyType: "VRM";
  public declare parentTypes: [PropertyType.ROOT];

  protected init(): void {
    this.extensionName = UNIVRM;
    this.propertyType = "VRM";
    this.parentTypes = [PropertyType.ROOT];
  }

  public setExporterVersion(exporterVersion: string) {
    return this.set("exporterVersion", exporterVersion);
  }

  public getExporterVersion() {
    return this.get("exporterVersion");
  }

  public setMetaJSONString(metaJSONString: string): this {
    return this.set("metaJSONString", metaJSONString);
  }

  public getMeta(): VRMType.Meta | undefined {
    const metaJSONString = this.get("metaJSONString");

    if (metaJSONString) {
      return JSON.parse(metaJSONString) as VRMType.Meta;
    }

    return undefined;
  }

  public setHumanoidJSONString(humanoidJSONString: string): this {
    return this.set("humanoidJSONString", humanoidJSONString);
  }

  public getHumanoid(): VRMType.Humanoid | undefined {
    const humanoidJSONString = this.get("humanoidJSONString");

    if (humanoidJSONString) {
      return JSON.parse(humanoidJSONString) as VRMType.Humanoid;
    }

    return undefined;
  }

  public setFirstPersonJSONString(firstPersonJSONString: string): this {
    return this.set("firstPersonJSONString", firstPersonJSONString);
  }

  public getFirstPerson(): VRMType.FirstPerson | undefined {
    const firstPersonJSONString = this.get("firstPersonJSONString");

    if (firstPersonJSONString) {
      return JSON.parse(firstPersonJSONString) as VRMType.FirstPerson;
    }

    return undefined;
  }

  public setBlendShapeMasterJSONString(
    blendShapeMasterJSONString: string
  ): this {
    return this.set("blendShapeMasterJSONString", blendShapeMasterJSONString);
  }

  public getBlendShapeMaster(): VRMType.BlendShape | undefined {
    const blendShapeMasterJSONString = this.get("blendShapeMasterJSONString");

    if (blendShapeMasterJSONString) {
      return JSON.parse(blendShapeMasterJSONString) as VRMType.BlendShape;
    }

    return undefined;
  }

  public setSecondaryAnimationJSONString(
    secondaryAnimationJSONString: string
  ): this {
    return this.set(
      "secondaryAnimationJSONString",
      secondaryAnimationJSONString
    );
  }

  public getSecondaryAnimation(): VRMType.SecondaryAnimation | undefined {
    const secondaryAnimationJSONString = this.get(
      "secondaryAnimationJSONString"
    );

    if (secondaryAnimationJSONString) {
      return JSON.parse(
        secondaryAnimationJSONString
      ) as VRMType.SecondaryAnimation;
    }

    return undefined;
  }

  public setMaterialPropertiesJSONString(
    materialPropertiesJSONString: string
  ): this {
    return this.set(
      "materialPropertiesJSONString",
      materialPropertiesJSONString
    );
  }

  public getMaterialProperties(): VRMType.Material[] | undefined {
    const materialPropertiesJSONString = this.get(
      "materialPropertiesJSONString"
    );

    if (materialPropertiesJSONString) {
      return JSON.parse(materialPropertiesJSONString) as VRMType.Material[];
    }

    return undefined;
  }
}
