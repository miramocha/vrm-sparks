import {
  ExtensionProperty,
  IProperty,
  Nullable,
  PropertyType,
  Texture,
  TextureInfo,
  TextureChannel,
  vec3,
} from "@gltf-transform/core";
import { VRM0 } from "./constants.ts";

const { R, G, B, A } = TextureChannel;

const NAME = VRM0; // CHANGE THIS FOR VRM1

/**
 * @see https://github.com/vrm-c/vrm-specification/blob/master/specification/VRMC_materials_mtoon-1.0/README.md
 */
export interface IMaterialMToon extends IProperty {
  specVersion: "1.0" | "1.0-beta";

  transparentWithZWrite: boolean;
  renderQueueOffsetNumber: number;

  /**
   * Lighting
   */
  // litColorFactor: vec3; - VRM0
  // litTexture: Texture; - VRM0
  // litTextureInfo: TextureInfo - VRM0
  // normalTexture: Texture; - VRM0
  // normalTextureInfo: TextureInfo - VRM0
  shadeColorFactor: vec3;
  shadeMultiplyTexture: Texture;
  shadeMultiplyTextureInfo: TextureInfo;
  shadingShiftFactor: number;
  shadingShiftTexture: Texture;
  shadingShiftTextureInfo: TextureInfo;
  shadingToonyFactor: number;
  giEqualizationFactor: number;

  /**
   * Rim
   */
  matcapFactor: vec3;
  matcapTexture: Texture;
  matcapTextureInfo: TextureInfo;
  parametricRimColorFactor: vec3;
  rimMultiplyTexture: Texture;
  rimMultiplyTextureInfo: TextureInfo;
  rimLightingMixFactor: number;
  parametricRimFresnelPowerFactor: number;
  parametricRimLiftFactor: number;

  /**
   * Outline
   */
  outlineWidthMode: "none" | "worldCoordinates" | "screenCoordinates";
  outlineWidthFactor: number;
  outlineWidthMultiplyTexture: Texture;
  outlineWidthMultiplyTextureInfo: TextureInfo;
  outlineColorFactor: vec3;
  outlineLightingMixFactor: number;

  /**
   * UV Animation
   */
  uvAnimationMaskTexture: Texture;
  uvAnimationMaskTextureInfo: TextureInfo;
  uvAnimationScrollXSpeedFactor: number;
  uvAnimationScrollYSpeedFactor: number;
  uvAnimationRotationSpeedFactor: number;
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

  protected getDefaults(): Nullable<IMaterialMToon> {
    return Object.assign(super.getDefaults() as IProperty, {
      specVersion: "1.0",

      transparentWithZWrite: false,
      renderQueueOffsetNumber: 0,

      /**
       * Lighting
       */
      // litColorFactor: vec3; - VRM0
      // litTexture: Texture; - VRM0
      // litTextureInfo: TextureInfo - VRM0
      // normalTexture: Texture; - VRM0
      // normalTextureInfo: TextureInfo - VRM0
      shadeColorFactor: [0, 0, 0],
      shadeMultiplyTexture: null,
      shadeMultiplyTextureInfo: new TextureInfo(
        this.graph,
        "shadeMultiplyTextureInfo"
      ),
      shadingShiftFactor: 0.0,
      shadingShiftTexture: null,
      shadingShiftTextureInfo: new TextureInfo(
        this.graph,
        "shadingShiftTextureInfo"
      ),
      shadingToonyFactor: 0.9,
      giEqualizationFactor: 0.9,

      /**
       * Rim
       */
      matcapFactor: [1, 1, 1],
      matcapTexture: null,
      matcapTextureInfo: new TextureInfo(this.graph, "matcapTextureInfo"),
      parametricRimColorFactor: [0, 0, 0],
      rimMultiplyTexture: null,
      rimMultiplyTextureInfo: new TextureInfo(
        this.graph,
        "rimMultiplyTextureInfo"
      ),
      rimLightingMixFactor: 1.0,
      parametricRimFresnelPowerFactor: 5.0,
      parametricRimLiftFactor: 0.0,

      /**
       * Outline
       */
      outlineWidthMode: "none",
      outlineWidthFactor: 0.0,
      outlineWidthMultiplyTexture: null,
      outlineWidthMultiplyTextureInfo: new TextureInfo(
        this.graph,
        "outlineWidthMultiplyTextureInfo"
      ),
      outlineColorFactor: [0, 0, 0],
      outlineLightingMixFactor: 1.0,

      /**
       * UV Animation
       */
      uvAnimationMaskTexture: null,
      uvAnimationMaskTextureInfo: new TextureInfo(
        this.graph,
        "uvAnimationMaskTextureInfo"
      ),
      uvAnimationScrollXSpeedFactor: 0.0,
      uvAnimationScrollYSpeedFactor: 0.0,
      uvAnimationRotationSpeedFactor: 0.0,
    });
  }
}
