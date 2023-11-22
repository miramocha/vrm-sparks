import {
  ExtensionProperty,
  IProperty,
  PropertyType,
  Texture,
  TextureInfo,
} from "@gltf-transform/core";
import { VRMCMaterialsMToon } from "@pixiv/types-vrmc-materials-mtoon-1.0";
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
  shadeMultiplyTexture: Texture;
  shadeMultiplyTextureInfo: TextureInfo;
  // shadingShiftFactor?: number;
  shadingShiftTexture: Texture;
  shadingShiftTextureInfo: TextureInfo;
  // shadingToonyFactor?: number;
  // giEqualizationFactor?: number;
  // matcapFactor?: number[];
  // // MatCap
  matcapTexture: Texture;
  matcapTextureInfo: TextureInfo;
  // // Rim
  // parametricRimColorFactor?: number[];
  rimMultiplyTexture: Texture;
  rimMultiplyTextureInfo: TextureInfo;
  // rimLightingMixFactor?: number;
  // parametricRimFresnelPowerFactor?: number;
  // parametricRimLiftFactor?: number;
  // // Outline
  // outlineWidthMode?: MaterialsMToonOutlineWidthMode;
  // outlineWidthFactor?: number;
  outlineWidthMultiplyTexture: Texture;
  outlineWidthMultiplyTextureInfo: Texture;
  // outlineColorFactor?: number[];
  // outlineLightingMixFactor?: number;
  // // Animation
  uvAnimationMaskTexture: Texture;
  uvAnimationMaskTextureInfo: TextureInfo;
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

  public setVRMCMaterialsMToon(vrmcMaterialsMToon: VRMCMaterialsMToon): this {
    return this.set(
      "serializedVRMCMaterialsMToon",
      JSON.stringify(vrmcMaterialsMToon)
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
