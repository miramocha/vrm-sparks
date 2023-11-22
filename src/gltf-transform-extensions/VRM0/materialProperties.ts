import {
  ExtensionProperty,
  IProperty,
  Nullable,
  PropertyType,
  Texture,
  TextureInfo,
  TextureChannel,
  vec4,
} from "@gltf-transform/core";
import { VRM0 } from "./constants.ts";

const { R, G, B, A } = TextureChannel;

const NAME = VRM0;

// floatProperties?: {
//     [key: string]: any;
// };
// keywordMap?: {
//     [key: string]: any;
// };
// name?: string;
// renderQueue?: number;
// shader?: string;
// tagMap?: {
//     [key: string]: any;
// };
// textureProperties?: {
//     [key: string]: any;
// };
// vectorProperties?: {
//     [key: string]: any;
// };

interface IMaterialProperties extends IProperty {
  name: string;
  mainColor: vec4;
  mainTexture: Texture;
  mainTextureInfo: TextureInfo;
  shadeColor: vec4;
  shadeTexture: Texture;
  shadeTextureInfo: TextureInfo;
  bumpMapTexture: Texture;
  bumpMapTextureInfo: TextureInfo;
  emissionColor: vec4;
  emissionMapTexture: Texture;
  emissionMapTextureInfo: TextureInfo;
  sphereAddTexture: Texture;
  sphereAddTextureInfo: TextureInfo;
  rimColor: vec4;
  rimTexture: Texture;
  rimTextureInfo: TextureInfo;
  outlineColor: vec4;
  outlineWidthTexture: Texture;
  outlineWidthTextureInfo: TextureInfo;
}

export default class MaterialProperties extends ExtensionProperty<IMaterialProperties> {
  public static EXTENSION_NAME = NAME;
  public declare extensionName: typeof NAME;
  public declare propertyType: "VRM";
  public declare parentTypes: [PropertyType.MATERIAL];

  protected init(): void {
    this.extensionName = NAME;
    this.propertyType = "VRM";
    this.parentTypes = [PropertyType.MATERIAL];
  }

  protected getDefaults(): Nullable<IMaterialProperties> {
    return Object.assign(super.getDefaults() as IProperty, {
      mainColor: [1, 1, 1, 1] as vec4,
      mainTexture: null,
      mainTextureInfo: new TextureInfo(this.graph, "mainTextureInfo"),
      shadeColor: [1, 1, 1, 1] as vec4,
      shadeTexture: null,
      shadeTextureInfo: new TextureInfo(this.graph, "shadeTextureInfo"),
      bumpMapTexture: null,
      bumpMapTextureInfo: new TextureInfo(this.graph, "bumpMapTextureInfo"),
      emissionColor: [0, 0, 0, 1] as vec4,
      emissionMapTexture: null,
      emissionMapTextureInfo: new TextureInfo(
        this.graph,
        "emissionMapTextureInfo"
      ),
      sphereAddTexture: null,
      sphereAddTextureInfo: new TextureInfo(this.graph, "sphereAddTextureInfo"),
      rimColor: [1, 1, 1, 1] as vec4,
      rimTexture: null,
      rimTextureInfo: new TextureInfo(this.graph, "rimTextureInfo"),
      outlineColor: [0, 0, 0, 1] as vec4,
      outlineWidthTexture: null,
      outlineWidthTextureInfo: new TextureInfo(
        this.graph,
        "outlineWidthTextureInfo"
      ),
    });
  }

  public setName(name: string): this {
    return this.set("name", name);
  }
  public getName(): string {
    return this.get("name");
  }

  public setMainColor(rgba: vec4): this {
    return this.set("mainColor", rgba);
  }
  public getMainColor(): vec4 {
    return this.get("mainColor");
  }
  public getMainTextureInfo(): TextureInfo | null {
    return this.getRef("mainTexture") ? this.getRef("mainTextureInfo") : null;
  }
  public getMainTexture(): Texture | null {
    return this.getRef("mainTexture");
  }
  public setMainTexture(texture: Texture | null): this {
    return this.setRef("mainTexture", texture, {
      channels: R | G | B | A,
      isColor: true,
    });
  }

  public setShadeColor(rgba: vec4): this {
    return this.set("shadeColor", rgba);
  }
  public getShadeColor(): vec4 {
    return this.get("shadeColor");
  }
  public getShadeTextureInfo(): TextureInfo | null {
    return this.getRef("shadeTexture") ? this.getRef("shadeTextureInfo") : null;
  }
  public getShadeTexture(): Texture | null {
    return this.getRef("shadeTexture");
  }
  public setShadeTexture(texture: Texture | null): this {
    return this.setRef("shadeTexture", texture, {
      channels: R | G | B | A,
      isColor: true,
    });
  }

  public getBumpMapTextureInfo(): TextureInfo | null {
    return this.getRef("bumpMapTexture")
      ? this.getRef("bumpMapTextureInfo")
      : null;
  }
  public getBumpMapTexture(): Texture | null {
    return this.getRef("bumpMapTexture");
  }
  public setBumpMapTexture(texture: Texture | null): this {
    return this.setRef("bumpMapTexture", texture, {
      channels: R | G | B | A,
      isColor: true,
    });
  }

  public setEmissionColor(rgba: vec4): this {
    return this.set("emissionColor", rgba);
  }
  public getEmissionColor(): vec4 {
    return this.get("emissionColor");
  }
  public getEmissionMapTextureInfo(): TextureInfo | null {
    return this.getRef("emissionMapTexture")
      ? this.getRef("emissionMapTextureInfo")
      : null;
  }
  public getEmissionMapTexture(): Texture | null {
    return this.getRef("emissionMapTexture");
  }
  public setEmissionMapTexture(texture: Texture | null): this {
    return this.setRef("emissionMapTexture", texture, {
      channels: R | G | B | A,
      isColor: true,
    });
  }

  public getSphereAddTextureInfo(): TextureInfo | null {
    return this.getRef("sphereAddTexture")
      ? this.getRef("sphereAddTextureInfo")
      : null;
  }
  public getSphereAddTexture(): Texture | null {
    return this.getRef("sphereAddTexture");
  }
  public setSphereAddTexture(texture: Texture | null): this {
    return this.setRef("sphereAddTexture", texture, {
      channels: R | G | B | A,
      isColor: true,
    });
  }

  public setRimColor(rgba: vec4): this {
    return this.set("rimColor", rgba);
  }
  public getRimColor(): vec4 {
    return this.get("rimColor");
  }
  public getRimTextureInfo(): TextureInfo | null {
    return this.getRef("rimTexture") ? this.getRef("rimTextureInfo") : null;
  }
  public getRimTexture(): Texture | null {
    return this.getRef("rimTexture");
  }
  public setRimTexture(texture: Texture | null): this {
    return this.setRef("rimTexture", texture, {
      channels: R | G | B | A,
      isColor: true,
    });
  }

  public setOutlineColor(rgba: vec4): this {
    return this.set("outlineColor", rgba);
  }
  public getOutlineColor(): vec4 {
    return this.get("outlineColor");
  }
  public getOutlineWidthTextureInfo(): TextureInfo | null {
    return this.getRef("outlineWidthTexture")
      ? this.getRef("outlineWidthTextureInfo")
      : null;
  }
  public getOutlineWidthTexture(): Texture | null {
    return this.getRef("outlineWidthTexture");
  }
  public setOutlineWidthTexture(texture: Texture | null): this {
    return this.setRef("outlineWidthTexture", texture, {
      channels: R | G | B | A,
      isColor: true,
    });
  }
}
