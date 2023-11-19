import {
  ExtensionProperty,
  IProperty,
  PropertyType,
} from "@gltf-transform/core";
import * as UniVRMType from "@pixiv/types-vrm-0.0";
import { UNIVRM } from "./constants.ts";

const NAME = UNIVRM;

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

  public setSerializedMeta(serializedMeta: string): this {
    return this.set("serializedMeta", serializedMeta);
  }

  public getMeta(): UniVRMType.Meta | undefined {
    const serializedMeta = this.get("serializedMeta");

    if (serializedMeta) {
      return JSON.parse(serializedMeta) as UniVRMType.Meta;
    }

    return undefined;
  }

  public setSerializedHumanoid(serializedHumanoid: string): this {
    return this.set("serializedHumanoid", serializedHumanoid);
  }

  public getHumanoid(): UniVRMType.Humanoid | undefined {
    const serializedHumanoid = this.get("serializedHumanoid");

    if (serializedHumanoid) {
      return JSON.parse(serializedHumanoid) as UniVRMType.Humanoid;
    }

    return undefined;
  }

  public setSerializedFirstPerson(serializedFirstPerson: string): this {
    return this.set("serializedFirstPerson", serializedFirstPerson);
  }

  public getFirstPerson(): UniVRMType.FirstPerson | undefined {
    const serializedFirstPerson = this.get("serializedFirstPerson");

    if (serializedFirstPerson) {
      return JSON.parse(serializedFirstPerson) as UniVRMType.FirstPerson;
    }

    return undefined;
  }

  public setSerializedBlendShapeMaster(
    serializedBlendShapeMaster: string
  ): this {
    return this.set("serializedBlendShapeMaster", serializedBlendShapeMaster);
  }

  public getBlendShapeMaster(): UniVRMType.BlendShape | undefined {
    const serializedBlendShapeMaster = this.get("serializedBlendShapeMaster");

    if (serializedBlendShapeMaster) {
      return JSON.parse(serializedBlendShapeMaster) as UniVRMType.BlendShape;
    }

    return undefined;
  }

  public setSerializedSecondaryAnimation(
    serializedSecondaryAnimation: string
  ): this {
    return this.set(
      "serializedSecondaryAnimation",
      serializedSecondaryAnimation
    );
  }

  public getSecondaryAnimation(): UniVRMType.SecondaryAnimation | undefined {
    const serializedSecondaryAnimation = this.get(
      "serializedSecondaryAnimation"
    );

    if (serializedSecondaryAnimation) {
      return JSON.parse(
        serializedSecondaryAnimation
      ) as UniVRMType.SecondaryAnimation;
    }

    return undefined;
  }

  public setSerializedMaterialProperties(
    serializedMaterialProperties: string
  ): this {
    return this.set(
      "serializedMaterialProperties",
      serializedMaterialProperties
    );
  }

  public getMaterialProperties(): UniVRMType.Material[] | undefined {
    const serializedMaterialProperties = this.get(
      "serializedMaterialProperties"
    );

    if (serializedMaterialProperties) {
      return JSON.parse(serializedMaterialProperties) as UniVRMType.Material[];
    }

    return undefined;
  }
}
