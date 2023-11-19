import {
  ExtensionProperty,
  IProperty,
  PropertyType,
} from "@gltf-transform/core";
import {
  VRMCMaterialsMToon,
  // MaterialsMToonTextureInfo,
  // MaterialsMToonShadingShiftTextureInfo,
  // MaterialsMToonOutlineWidthMode,
} from "@pixiv/types-vrmc-materials-mtoon-1.0";
import { VRMC_MATERIALS_MTOON } from "./constants.ts";

const NAME = VRMC_MATERIALS_MTOON;

interface IMaterialMToon extends IProperty {
  serializedVRMCMaterialsMToon: string;
  // specVersion: "1.0" | "1.0-beta";
  // transparentWithZWrite?: boolean;
  // renderQueueOffsetNumber?: number;
  // /**
  //  * Lighting
  //  */
  // shadeColorFactor?: number[];
  // shadeMultiplyTexture?: MaterialsMToonTextureInfo;
  // shadingShiftFactor?: number;
  // shadingShiftTexture?: MaterialsMToonShadingShiftTextureInfo;
  // shadingToonyFactor?: number;
  // giEqualizationFactor?: number;
  // matcapFactor?: number[];
  // // MatCap
  // matcapTexture?: MaterialsMToonTextureInfo;
  // // Rim
  // parametricRimColorFactor?: number[];
  // rimMultiplyTexture?: MaterialsMToonTextureInfo;
  // rimLightingMixFactor?: number;
  // parametricRimFresnelPowerFactor?: number;
  // parametricRimLiftFactor?: number;
  // // Outline
  // outlineWidthMode?: MaterialsMToonOutlineWidthMode;
  // outlineWidthFactor?: number;
  // outlineWidthMultiplyTexture?: MaterialsMToonTextureInfo;
  // outlineColorFactor?: number[];
  // outlineLightingMixFactor?: number;
  // // Animation
  // uvAnimationMaskTexture?: MaterialsMToonTextureInfo;
  // uvAnimationScrollXSpeedFactor?: number;
  // uvAnimationScrollYSpeedFactor?: number;
  // uvAnimationRotationSpeedFactor?: number;
  // // Misc
  // extensions?: {
  //   [name: string]: any;
  // };
  // extras?: any;
}

export default class MaterialMToon extends ExtensionProperty<IMaterialMToon> {
  public static EXTENSION_NAME = NAME;
  public declare extensionName: typeof NAME;
  public declare propertyType: "VRMC_materials_mtoon";
  public declare parentTypes: [PropertyType.MATERIAL];

  protected init(): void {
    this.extensionName = NAME;
    this.propertyType = "VRMC_materials_mtoon";
    this.parentTypes = [PropertyType.MATERIAL];
  }

  public setSerializedVRMCMaterialsMToon(
    serializedVRMCMaterialsMToon: string
  ): this {
    return this.set(
      "serializedVRMCMaterialsMToon",
      serializedVRMCMaterialsMToon
    );
  }

  public getVRMCMaterialsMToon(): VRMCMaterialsMToon | undefined {
    const serializedVRMCMaterialsMToon = this.get(
      "serializedVRMCMaterialsMToon"
    );

    if (serializedVRMCMaterialsMToon) {
      return JSON.parse(serializedVRMCMaterialsMToon) as VRMCMaterialsMToon;
    }

    return undefined;
  }
}
