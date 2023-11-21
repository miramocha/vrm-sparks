import {
  Extension,
  // Material,
  ReaderContext,
  Texture,
  TextureInfo,
  WriterContext,
} from "@gltf-transform/core";
import * as VRM0Type from "@pixiv/types-vrm-0.0";
import VRM from "./VRM.ts";
import { VRM0 } from "./constants.ts";
import MaterialProperties from "./materialProperties.ts";

const NAME = VRM0;

export default class VRM0_vrm extends Extension {
  public readonly extensionName = NAME;
  public static readonly EXTENSION_NAME = NAME;

  public createMaterialProperties(): MaterialProperties {
    return new MaterialProperties(this.document.getGraph());
  }

  public read(context: ReaderContext): this {
    const jsonDoc = context.jsonDoc;

    console.log("READ TEXTURES", context.jsonDoc.json.textures);

    if (jsonDoc.json.extensions && jsonDoc.json.extensions[NAME]) {
      const vrmDef = jsonDoc.json.extensions[NAME] as VRM0Type.VRM;
      const textureDefs = jsonDoc.json.textures || [];

      const vrm = new VRM(this.document.getGraph());
      this.document.getRoot().setExtension(NAME, vrm);

      const attachTextureToExtension = (
        textureIndex: number,
        setTextureFunction: (texture: Texture) => MaterialProperties | VRM,
        getTextureInfoFunction: () => TextureInfo | null
      ) => {
        const texture = context.textures[textureDefs[textureIndex].source!];
        setTextureFunction(texture);
        context.setTextureInfo(getTextureInfoFunction()!, {
          index: textureIndex,
        });
      };

      if (vrmDef.exporterVersion) {
        vrm.setExporterVersion(vrmDef.exporterVersion as string);
      }

      if (vrmDef.meta) {
        vrm.setMeta(vrmDef.meta);

        const metaTextureIndex = vrmDef.meta.texture;

        if (metaTextureIndex !== undefined) {
          attachTextureToExtension(
            metaTextureIndex,
            vrm.setThumbnailTexture,
            vrm.getThumbnailTextureInfo
          );
        }
      }

      if (vrmDef.humanoid) {
        vrm.setHumanoid(vrmDef.humanoid);
      }

      if (vrmDef.firstPerson) {
        vrm.setFirstPerson(vrmDef.firstPerson);
      }

      if (vrmDef.blendShapeMaster) {
        vrm.setBlendShapeMaster(vrmDef.blendShapeMaster);
      }

      if (vrmDef.secondaryAnimation) {
        vrm.setSecondaryAnimation(vrmDef.secondaryAnimation);
      }

      if (vrmDef.materialProperties) {
        vrm.setMaterialProperties(vrmDef.materialProperties);

        vrmDef.materialProperties.forEach(
          (
            materialPropertiesDef: VRM0Type.Material,
            materialPropertiesDefIndex
          ) => {
            const materialProperties = this.createMaterialProperties();
            const material = context.materials[materialPropertiesDefIndex];
            material.setExtension(NAME, materialProperties);

            const texturePropertiesDef =
              materialPropertiesDef.textureProperties || {};

            // Textures
            if (texturePropertiesDef) {
              if (texturePropertiesDef._MainTex !== undefined) {
                attachTextureToExtension(
                  texturePropertiesDef._MainTex,
                  materialProperties.setMainTexture,
                  materialProperties.getMainTextureInfo
                );
              }

              if (texturePropertiesDef._ShadeTexture !== undefined) {
                attachTextureToExtension(
                  texturePropertiesDef._ShadeTexture,
                  materialProperties.setShadeTexture,
                  materialProperties.getShadeTextureInfo
                );
              }

              if (texturePropertiesDef._BumpMap !== undefined) {
                attachTextureToExtension(
                  texturePropertiesDef._BumpMap,
                  materialProperties.setBumpMapTexture,
                  materialProperties.getBumpMapTextureInfo
                );
              }

              if (texturePropertiesDef._EmissionMap !== undefined) {
                attachTextureToExtension(
                  texturePropertiesDef._EmissionMap,
                  materialProperties.setEmissionMapTexture,
                  materialProperties.getEmissionMapTextureInfo
                );
              }

              if (texturePropertiesDef._SphereAdd !== undefined) {
                attachTextureToExtension(
                  texturePropertiesDef._SphereAdd,
                  materialProperties.setSphereAddTexture,
                  materialProperties.getSphereAddTextureInfo
                );
              }

              if (texturePropertiesDef._RimTexture !== undefined) {
                attachTextureToExtension(
                  texturePropertiesDef._RimTexture,
                  materialProperties.setRimTexture,
                  materialProperties.getRimTextureInfo
                );
              }

              if (texturePropertiesDef._OutlineWidthTexture !== undefined) {
                attachTextureToExtension(
                  texturePropertiesDef._OutlineWidthTexture,
                  materialProperties.setOutlineWidthTexture,
                  materialProperties.getOutlineWidthTextureInfo
                );
              }
            }

            material.setExtension(NAME, materialProperties);
          }
        );
      }
    }

    return this;
  }

  public write(context: WriterContext): this {
    const jsonDoc = context.jsonDoc;

    const vrm = this.document.getRoot().getExtension<VRM>(NAME);

    console.log("WRITE TEXTURES", context.jsonDoc.json.textures);

    if (vrm) {
      const vrmDef = {} as VRM0Type.VRM;
      const rootDef = jsonDoc.json;
      rootDef.extensions = rootDef.extensions || {};

      vrmDef.specVersion = "0.0";

      if (vrm.getExporterVersion()) {
        vrmDef.exporterVersion = vrm.getExporterVersion();
      }

      if (vrm.getMeta()) {
        vrmDef.meta = vrm.getMeta() || {};

        // if (vrm.getThumbnailTexture()) {
        // }
      }

      if (vrm.getHumanoid()) {
        vrmDef.humanoid = vrm.getHumanoid();
      }

      if (vrm.getFirstPerson()) {
        vrmDef.firstPerson = vrm.getFirstPerson();
      }

      if (vrm.getBlendShapeMaster()) {
        vrmDef.blendShapeMaster = vrm.getBlendShapeMaster();
      }

      if (vrm.getSecondaryAnimation()) {
        vrmDef.secondaryAnimation = vrm.getSecondaryAnimation();
      }

      if (vrm.getMaterialProperties()) {
        vrmDef.materialProperties = vrm.getMaterialProperties();

        // if (textureDefs) {
        // }
      }

      rootDef.extensions[NAME] = vrmDef;
    }

    console.log("POST WRITE -> GLTF JSON", jsonDoc.json);

    return this;
  }
}
