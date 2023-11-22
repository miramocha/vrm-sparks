import {
  ExtensionProperty,
  IProperty,
  Nullable,
  PropertyType,
  Texture,
  TextureInfo,
  TextureChannel,
} from "@gltf-transform/core";
import { VRM0 } from "./constants.ts";

const { R, G, B, A } = TextureChannel;

const NAME = VRM0;

interface IMaterialProperties extends IProperty {
  mainTexture: Texture;
  mainTextureInfo: TextureInfo;
  shadeTexture: Texture;
  shadeTextureInfo: TextureInfo;
  bumpMapTexture: Texture;
  bumpMapTextureInfo: TextureInfo;
  emissionMapTexture: Texture;
  emissionMapTextureInfo: TextureInfo;
  sphereAddTexture: Texture;
  sphereAddTextureInfo: TextureInfo;
  rimTexture: Texture;
  rimTextureInfo: TextureInfo;
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
      mainTexture: null,
      mainTextureInfo: new TextureInfo(this.graph, "mainTextureInfo"),
      shadeTexture: null,
      shadeTextureInfo: new TextureInfo(this.graph, "shadeTextureInfo"),
      bumpMapTexture: null,
      bumpMapTextureInfo: new TextureInfo(this.graph, "bumpMapTextureInfo"),
      emissionMapTexture: null,
      emissionMapTextureInfo: new TextureInfo(
        this.graph,
        "emissionMapTextureInfo"
      ),
      sphereAddTexture: null,
      sphereAddTextureInfo: new TextureInfo(this.graph, "sphereAddTextureInfo"),
      rimTexture: null,
      rimTextureInfo: new TextureInfo(this.graph, "rimTextureInfo"),
      outlineWidthTexture: null,
      outlineWidthTextureInfo: new TextureInfo(
        this.graph,
        "outlineWidthTextureInfo"
      ),
    });
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
