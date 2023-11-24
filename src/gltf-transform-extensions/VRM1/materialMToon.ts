import {
  ExtensionProperty,
  PropertyType,
  IProperty,
  Texture,
} from "@gltf-transform/core";
import { VRMC_MATERIALS_MTOON } from "./constants.ts";

const NAME = VRMC_MATERIALS_MTOON;

export interface IMaterialMToon extends IProperty {
  /**
   * Specification version of VRMC_materials_mtoon
   */
  specVersion: "1.0" | "1.0-beta";
  /**
   * enable depth buffer when renderMode is transparent
   */
  transparentWithZWrite?: boolean;
  /**
   *
   */
  renderQueueOffsetNumber?: number;
  /**
   *
   */
  shadeColorFactor?: number[];
  /**
   *
   */
  shadeMultiplyTexture?: Texture;
  /**
   * Lighting
   */
  shadingShiftFactor?: number;
  /**
   *
   */
  shadingShiftTexture?: Texture;
  /**
   *
   */
  shadingToonyFactor?: number;
  /**
   *
   */
  giEqualizationFactor?: number;
  /**
   *
   */
  matcapFactor?: number[];
  /**
   * MatCap
   */
  //   matcapTexture?: MaterialsMToonTextureInfo;
  /**
   * Rim
   */
  parametricRimColorFactor?: number[];
  /**
   *
   */
  //   rimMultiplyTexture?: MaterialsMToonTextureInfo;
  /**
   *
   */
  rimLightingMixFactor?: number;
  /**
   *
   */
  parametricRimFresnelPowerFactor?: number;
  /**
   *
   */
  parametricRimLiftFactor?: number;
  /**
   * Outline
   */
  //   outlineWidthMode?: MaterialsMToonOutlineWidthMode;
  /**
   *
   */
  outlineWidthFactor?: number;
  /**
   *
   */
  //   outlineWidthMultiplyTexture?: MaterialsMToonTextureInfo;
  /**
   *
   */
  outlineColorFactor?: number[];
  /**
   *
   */
  outlineLightingMixFactor?: number;
  /**
   *
   */
  //   uvAnimationMaskTexture?: MaterialsMToonTextureInfo;
  /**
   *
   */
  uvAnimationScrollXSpeedFactor?: number;
  /**
   *
   */
  uvAnimationScrollYSpeedFactor?: number;
  /**
   *
   */
  uvAnimationRotationSpeedFactor?: number;
  //   extensions?: {
  //     [name: string]: any;
  //   };
  //   extras?: any;
}

export default class MaterialMToon extends ExtensionProperty<IMaterialMToon> {
  public static EXTENSION_NAME = NAME;
  public declare extensionName: typeof NAME;
  public declare propertyType: "VRMC_MaterialsMToon";
  public declare parentTypes: [PropertyType.MATERIAL];

  protected init(): void {
    this.extensionName = NAME;
    this.propertyType = "VRMC_MaterialsMToon";
    this.parentTypes = [PropertyType.MATERIAL];
  }
}
