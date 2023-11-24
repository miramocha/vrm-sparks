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

const { R, G, B } = TextureChannel;

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

  public getSpecVersion(): "1.0" | "1.0-beta" {
    return this.get("specVersion");
  }
  public setSpecVersion(specVersion: "1.0" | "1.0-beta"): this {
    return this.set("specVersion", specVersion);
  }

  public getTransparentWithZWrite(): boolean {
    return this.get("transparentWithZWrite");
  }
  public setTransparentWithZWrite(transparentWithZWrite: boolean): this {
    return this.set("transparentWithZWrite", transparentWithZWrite);
  }

  public getRenderQueueOffsetNumber(): number {
    return this.get("renderQueueOffsetNumber");
  }
  public setRenderQueueOffsetNumber(renderQueueOffsetNumber: number): this {
    return this.set("renderQueueOffsetNumber", renderQueueOffsetNumber);
  }

  /**********************************************************************************************
   * Lighting
   */
  public getShadeColorFactor(): vec3 {
    return this.get("shadeColorFactor");
  }
  public setShadeColorFactor(shadeColorFactor: vec3): this {
    return this.set("shadeColorFactor", shadeColorFactor);
  }

  public getShadeMultiplyTexture(): Texture | null {
    return this.getRef("shadeMultiplyTexture");
  }
  public setShadeMultiplyTextureInfo(texture: Texture | null): this {
    return this.setRef("shadeMultiplyTexture", texture, {
      channels: R | G | B,
    });
  }
  public getShadeMultiplyTextureInfo(): TextureInfo | null {
    return this.getRef("shadeMultiplyTexture")
      ? this.getRef("shadeMultiplyTextureInfo")
      : null;
  }

  public getShadingShiftFactor(): number {
    return this.get("shadingShiftFactor");
  }
  public setShadingShiftFactor(shadingShiftFactor: number): this {
    return this.set("shadingShiftFactor", shadingShiftFactor);
  }

  public getShadingShiftTexture(): Texture | null {
    return this.getRef("shadingShiftTexture");
  }
  public setShadingShiftTextureInfo(texture: Texture | null): this {
    return this.setRef("shadingShiftTexture", texture, {
      channels: R | G | B,
    });
  }
  public getShadingShiftTextureInfo(): TextureInfo | null {
    return this.getRef("shadingShiftTexture")
      ? this.getRef("shadingShiftTextureInfo")
      : null;
  }

  public getShadingToonyFactor(): number {
    return this.get("shadingToonyFactor");
  }
  public setShadingToonyFactor(shadingToonyFactor: number): this {
    return this.set("shadingToonyFactor", shadingToonyFactor);
  }

  public getGIEqualizationFactor(): number {
    return this.get("giEqualizationFactor");
  }
  public setGIEqualizationFactor(giEqualizationFactor: number): this {
    return this.set("giEqualizationFactor", giEqualizationFactor);
  }

  /**********************************************************************************************
   * Rim
   */
  public getMatcapFactor(): vec3 {
    return this.get("matcapFactor");
  }
  public setMatcapFactor(matcapFactor: vec3): this {
    return this.set("matcapFactor", matcapFactor);
  }

  public getMatcapTexture(): Texture | null {
    return this.getRef("matcapTexture");
  }
  public setMatcapTextureInfo(texture: Texture | null): this {
    return this.setRef("matcapTexture", texture, {
      channels: R | G | B,
    });
  }
  public getMatcapTextureInfo(): TextureInfo | null {
    return this.getRef("matcapTexture")
      ? this.getRef("matcapTextureInfo")
      : null;
  }

  public getParametricRimColorFactor(): vec3 {
    return this.get("parametricRimColorFactor");
  }
  public setParametricRimColorFactor(parametricRimColorFactor: vec3): this {
    return this.set("parametricRimColorFactor", parametricRimColorFactor);
  }

  public getRimMultiplyTexture(): Texture | null {
    return this.getRef("rimMultiplyTexture");
  }
  public setRimMultiplyTextureInfo(texture: Texture | null): this {
    return this.setRef("rimMultiplyTexture", texture, {
      channels: R | G | B,
    });
  }
  public getRimMultiplyTextureInfo(): TextureInfo | null {
    return this.getRef("rimMultiplyTexture")
      ? this.getRef("rimMultiplyTextureInfo")
      : null;
  }

  public getRimLightningMixFactor(): number {
    return this.get("rimLightingMixFactor");
  }
  public setRimLightningMixFactor(rimLightningMixFactor: number): this {
    return this.set("rimLightingMixFactor", rimLightningMixFactor);
  }

  public getParametricRimFresnelPowerFactor(): number {
    return this.get("parametricRimFresnelPowerFactor");
  }
  public setParametricRimFresnelPowerFactor(
    parametricRimFresnelPowerFactor: number
  ): this {
    return this.set(
      "parametricRimFresnelPowerFactor",
      parametricRimFresnelPowerFactor
    );
  }

  public getParametricRimLiftFactor(): number {
    return this.get("parametricRimLiftFactor");
  }
  public setParametricRimLiftFactor(parametricRimLiftFactor: number): this {
    return this.set("parametricRimLiftFactor", parametricRimLiftFactor);
  }

  /**********************************************************************************************
   * Outline
   */
  public getOutlineWidthMode():
    | "none"
    | "worldCoordinates"
    | "screenCoordinates" {
    return this.get("outlineWidthMode");
  }
  public setOutlineWidthMode(
    outlineWidthMode: "none" | "worldCoordinates" | "screenCoordinates"
  ) {
    return this.set("outlineWidthMode", outlineWidthMode);
  }

  public getOutlineWidthFactor(): number {
    return this.get("outlineWidthFactor");
  }
  public setOutlineWidthFactor(outlineWidthFactor: number): this {
    return this.set("outlineWidthFactor", outlineWidthFactor);
  }

  public getOutlineWidthMultiplyTexture(): Texture | null {
    return this.getRef("outlineWidthMultiplyTexture");
  }
  public setOutlineWidthMultiplyTextureInfo(texture: Texture | null): this {
    return this.setRef("outlineWidthMultiplyTexture", texture, {
      channels: R | G | B,
    });
  }
  public getOutlineWidthMultiplyTextureInfo(): TextureInfo | null {
    return this.getRef("outlineWidthMultiplyTexture")
      ? this.getRef("outlineWidthMultiplyTextureInfo")
      : null;
  }

  public getOutlineColorFactor(): vec3 {
    return this.get("outlineColorFactor");
  }
  public setOutlineColorFactor(outlineColorFactor: vec3): this {
    return this.set("outlineColorFactor", outlineColorFactor);
  }

  public getOutlineLightningMixFactor(): number {
    return this.get("outlineLightingMixFactor");
  }
  public setOutlineLightningMixFactor(outlineLightningMixFactor: number): this {
    return this.set("outlineLightingMixFactor", outlineLightningMixFactor);
  }

  /**********************************************************************************************
   * UV Animation
   */
  public getUVAnimationMaskTexture(): Texture | null {
    return this.getRef("uvAnimationMaskTexture");
  }
  public setUVAnimationMaskTextureInfo(texture: Texture | null): this {
    return this.setRef("uvAnimationMaskTexture", texture, {
      channels: R | G | B,
    });
  }
  public getUVAnimationMaskTextureInfo(): TextureInfo | null {
    return this.getRef("uvAnimationMaskTexture")
      ? this.getRef("uvAnimationMaskTextureInfo")
      : null;
  }

  public getUVAnimationScrollXSpeedFactor(): number {
    return this.get("uvAnimationScrollXSpeedFactor");
  }
  public setUVAnimationScrollXSpeedFactor(
    uvAnimationScrollXSpeedFactor: number
  ): this {
    return this.set(
      "uvAnimationScrollXSpeedFactor",
      uvAnimationScrollXSpeedFactor
    );
  }

  public getUVAnimationScrollYSpeedFactor(): number {
    return this.get("uvAnimationScrollYSpeedFactor");
  }
  public setUVAnimationScrollYSpeedFactor(
    uvAnimationScrollYSpeedFactor: number
  ): this {
    return this.set(
      "uvAnimationScrollYSpeedFactor",
      uvAnimationScrollYSpeedFactor
    );
  }

  public getUVAnimationRotationSpeedFactor(): number {
    return this.get("uvAnimationRotationSpeedFactor");
  }
  public setUVAnimationSRotationpeedFactor(
    uvAnimationRotationSpeedFactor: number
  ): this {
    return this.set(
      "uvAnimationRotationSpeedFactor",
      uvAnimationRotationSpeedFactor
    );
  }
}
