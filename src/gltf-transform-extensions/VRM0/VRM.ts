import {
  ExtensionProperty,
  IProperty,
  PropertyType,
} from "@gltf-transform/core";
import * as VRM0Type from "@pixiv/types-vrm-0.0";
import { VRM0 } from "./constants.ts";

const NAME = VRM0;

interface IVRM extends IProperty {
  //   specVersion?: "0.0";
  exporterVersion: string;
  serializedMeta: string;
  serializedHumanoid: string;
  serializedFirstPerson: string;
  serializedBlendShapeMaster: string;
  serializedSecondaryAnimation: string;
  serializedMaterialProperties: string;
}

export default class VRM extends ExtensionProperty<IVRM> {
  public static EXTENSION_NAME = NAME;
  public declare extensionName: typeof NAME;
  public declare propertyType: "VRM";
  public declare parentTypes: [PropertyType.ROOT];

  protected init(): void {
    this.extensionName = NAME;
    this.propertyType = "VRM";
    this.parentTypes = [PropertyType.ROOT];
  }

  public setExporterVersion(exporterVersion: string): this {
    return this.set("exporterVersion", exporterVersion);
  }

  public getExporterVersion() {
    return this.get("exporterVersion");
  }

  public setMeta(meta: VRM0Type.Meta): this {
    return this.set("serializedMeta", JSON.stringify(meta));
  }

  public getMeta(): VRM0Type.Meta | undefined {
    const serializedMeta = this.get("serializedMeta");

    if (serializedMeta) {
      return JSON.parse(serializedMeta) as VRM0Type.Meta;
    }

    return undefined;
  }

  public setHumanoid(humanoid: VRM0Type.Humanoid): this {
    return this.set("serializedHumanoid", JSON.stringify(humanoid));
  }

  public getHumanoid(): VRM0Type.Humanoid | undefined {
    const serializedHumanoid = this.get("serializedHumanoid");

    if (serializedHumanoid) {
      return JSON.parse(serializedHumanoid) as VRM0Type.Humanoid;
    }

    return undefined;
  }

  public setFirstPerson(firstPerson: VRM0Type.FirstPerson): this {
    return this.set("serializedFirstPerson", JSON.stringify(firstPerson));
  }

  public getFirstPerson(): VRM0Type.FirstPerson | undefined {
    const serializedFirstPerson = this.get("serializedFirstPerson");

    if (serializedFirstPerson) {
      return JSON.parse(serializedFirstPerson) as VRM0Type.FirstPerson;
    }

    return undefined;
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
}
