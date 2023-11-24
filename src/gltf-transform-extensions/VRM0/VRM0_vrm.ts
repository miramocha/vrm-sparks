import {
  Extension,
  ReaderContext,
  TextureInfo,
  WriterContext,
} from "@gltf-transform/core";
import * as VRM0Type from "@pixiv/types-vrm-0.0";
import VRM from "./VRM.ts";
import { VRM0 } from "./constants.ts";
import MaterialMToon from "./materialMtoon.ts";

const NAME = VRM0;

export default class VRM0_vrm extends Extension {
  public readonly extensionName = NAME;
  public static readonly EXTENSION_NAME = NAME;

  public createMaterialMToon(): MaterialMToon {
    return new MaterialMToon(this.document.getGraph());
  }

  public read(context: ReaderContext): this {
    const jsonDoc = context.jsonDoc;

    if (jsonDoc.json.extensions && jsonDoc.json.extensions[NAME]) {
      const vrmDef = jsonDoc.json.extensions[NAME] as VRM0Type.VRM;
      const textureDefs = jsonDoc.json.textures || [];

      const vrm = new VRM(this.document.getGraph());
      this.document.getRoot().setExtension(NAME, vrm);

      if (vrmDef.exporterVersion) {
        vrm.setExporterVersion(vrmDef.exporterVersion as string);
      }

      if (vrmDef.meta) {
        vrm.setMeta(vrmDef.meta);

        const metaTextureIndex = vrmDef.meta.texture;

        if (metaTextureIndex !== undefined) {
          const texture =
            context.textures[textureDefs[metaTextureIndex].source!];
          vrm.setThumbnailTexture(texture);
          context.setTextureInfo(vrm.getThumbnailTextureInfo()!, {
            index: metaTextureIndex,
          });
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
            const materialMToon = this.createMaterialMToon();
            const material = context.materials[materialPropertiesDefIndex];
            material.setExtension(NAME, materialMToon);

            const texturePropertiesDef =
              materialPropertiesDef.textureProperties || {};

            // PBR Textures Sync
            if (texturePropertiesDef._MainTex !== undefined) {
              const texture =
                context.textures[
                  textureDefs[texturePropertiesDef._MainTex].source!
                ];

              material.setBaseColorTexture(texture);
              context.setTextureInfo(
                new TextureInfo(material.getGraph(), "baseColorTextureInfo"),
                {
                  index: texturePropertiesDef._MainTex,
                }
              );
            }

            if (texturePropertiesDef._BumpMap !== undefined) {
              const texture =
                context.textures[
                  textureDefs[texturePropertiesDef._BumpMap].source!
                ];

              material.setNormalTexture(texture);
              context.setTextureInfo(
                new TextureInfo(material.getGraph(), "normalTextureInfo"),
                {
                  index: texturePropertiesDef._BumpMap,
                }
              );
            }

            if (texturePropertiesDef._EmissionMap !== undefined) {
              const texture =
                context.textures[
                  textureDefs[texturePropertiesDef._EmissionMap].source!
                ];

              material.setEmissiveTexture(texture);
              context.setTextureInfo(
                new TextureInfo(material.getGraph(), "emissiveTextureInfo"),
                {
                  index: texturePropertiesDef._EmissionMap,
                }
              );
            }

            // Textures
            if (texturePropertiesDef._ShadeTexture !== undefined) {
              const texture =
                context.textures[
                  textureDefs[texturePropertiesDef._ShadeTexture].source!
                ];

              materialMToon.setShadeMultiplyTexture(texture);
              context.setTextureInfo(
                materialMToon.getShadeMultiplyTextureInfo()!,
                {
                  index: texturePropertiesDef._ShadeTexture,
                }
              );
            }

            if (texturePropertiesDef._SphereAdd !== undefined) {
              const texture =
                context.textures[
                  textureDefs[texturePropertiesDef._SphereAdd].source!
                ];

              materialMToon.setMatcapTexture(texture);
              context.setTextureInfo(materialMToon.getMatcapTextureInfo()!, {
                index: texturePropertiesDef._SphereAdd,
              });
            }

            if (texturePropertiesDef._RimTexture !== undefined) {
              const texture =
                context.textures[
                  textureDefs[texturePropertiesDef._RimTexture].source!
                ];

              materialMToon.setRimMultiplyTexture(texture);
              context.setTextureInfo(
                materialMToon.getRimMultiplyTextureInfo()!,
                {
                  index: texturePropertiesDef._RimTexture,
                }
              );
            }

            if (texturePropertiesDef._OutlineWidthTexture !== undefined) {
              const texture =
                context.textures[
                  textureDefs[texturePropertiesDef._OutlineWidthTexture].source!
                ];

              materialMToon.setOutlineWidthMultiplyTexture(texture);
              context.setTextureInfo(
                materialMToon.getOutlineWidthMultiplyTextureInfo()!,
                {
                  index: texturePropertiesDef._OutlineWidthTexture,
                }
              );
            }

            const vectorPropertiesDef =
              materialPropertiesDef.vectorProperties || {};

            // Vectors
            if (vectorPropertiesDef._Color !== undefined) {
              material.setBaseColorFactor(
                vectorPropertiesDef._Color.slice(0, 3)
              );
            }

            if (vectorPropertiesDef._EmissionColor !== undefined) {
              material.setEmissiveFactor(
                vectorPropertiesDef._EmissionColor.slice(0, 3)
              );
            }

            if (vectorPropertiesDef._ShadeColor !== undefined) {
              materialMToon.setShadeColorFactor(
                vectorPropertiesDef._ShadeColor.slice(0, 3)
              );
            }

            if (vectorPropertiesDef._RimColor !== undefined) {
              materialMToon.setParametricRimColorFactor(
                vectorPropertiesDef._RimColor.slice(0, 3)
              );
            }

            if (vectorPropertiesDef._OutlineColor !== undefined) {
              materialMToon.setOutlineColorFactor(
                vectorPropertiesDef._OutlineColor.slice(0, 3)
              );
            }

            material.setExtension(NAME, materialMToon);
          }
        );
      }
    }

    return this;
  }

  public write(context: WriterContext): this {
    const jsonDoc = context.jsonDoc;

    const vrm = this.document.getRoot().getExtension<VRM>(NAME);

    if (vrm) {
      const vrmDef = {} as VRM0Type.VRM;
      const rootDef = jsonDoc.json;
      rootDef.extensions = rootDef.extensions || {};

      vrmDef.specVersion = "0.0";

      if (vrm.getExporterVersion()) {
        vrmDef.exporterVersion = "VRM-Sparks 0.0";
      }

      if (vrm.getMeta()) {
        vrmDef.meta = vrm.getMeta() || {};

        if (vrm.getThumbnailTexture()) {
          const texture = vrm.getThumbnailTexture();
          const textureInfo = vrm.getThumbnailTextureInfo()!;
          vrmDef.meta.texture = context.createTextureInfoDef(
            texture!,
            textureInfo
          ).index;
        }
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
        vrmDef.materialProperties = vrm.getMaterialProperties() || [];

        this.document
          .getRoot()
          .listMaterials()
          .forEach((material, materialIndex) => {
            const materialMToon = material.getExtension<MaterialMToon>(NAME);
            const materialPropertiesDef =
              vrmDef.materialProperties![materialIndex];

            materialPropertiesDef.name = material.getName();

            if (materialMToon && materialPropertiesDef) {
              // PBR Textures
              materialPropertiesDef.textureProperties =
                materialPropertiesDef.textureProperties || {};

              if (material.getBaseColorTexture()) {
                const texture = material.getBaseColorTexture()!;
                const textureInfo = material.getBaseColorTextureInfo()!;
                materialPropertiesDef.textureProperties._MainTex =
                  context.createTextureInfoDef(texture, textureInfo).index;
              }

              if (material.getNormalTexture()) {
                const texture = material.getNormalTexture()!;
                const textureInfo = material.getNormalTextureInfo()!;
                materialPropertiesDef.textureProperties._BumpMap =
                  context.createTextureInfoDef(texture, textureInfo).index;
              }

              if (material.getEmissiveTexture()) {
                const texture = material.getEmissiveTexture()!;
                const textureInfo = material.getEmissiveTextureInfo()!;
                materialPropertiesDef.textureProperties._EmissionMap =
                  context.createTextureInfoDef(texture, textureInfo).index;
              }

              // Textures
              if (materialMToon.getShadeMultiplyTexture()) {
                const texture = materialMToon.getShadeMultiplyTexture()!;
                const textureInfo =
                  materialMToon.getShadeMultiplyTextureInfo()!;
                materialPropertiesDef.textureProperties._ShadeTexture =
                  context.createTextureInfoDef(texture, textureInfo).index;
              }

              if (materialMToon.getMatcapTexture()) {
                const texture = materialMToon.getMatcapTexture()!;
                const textureInfo = materialMToon.getMatcapTextureInfo()!;
                materialPropertiesDef.textureProperties._SphereAdd =
                  context.createTextureInfoDef(texture, textureInfo).index;
              }

              if (materialMToon.getRimMultiplyTexture()) {
                const texture = materialMToon.getRimMultiplyTexture()!;
                const textureInfo = materialMToon.getRimMultiplyTextureInfo()!;
                materialPropertiesDef.textureProperties._RimTexture =
                  context.createTextureInfoDef(texture, textureInfo).index;
              }

              if (materialMToon.getOutlineWidthMultiplyTexture()) {
                const texture = materialMToon.getOutlineWidthMultiplyTexture()!;
                const textureInfo =
                  materialMToon.getOutlineWidthMultiplyTextureInfo()!;
                materialPropertiesDef.textureProperties._OutlineWidthTexture =
                  context.createTextureInfoDef(texture, textureInfo).index;
              }

              // Vectors
              materialPropertiesDef.vectorProperties =
                materialPropertiesDef.vectorProperties || {};

              if (material.getBaseColorFactor()) {
                materialPropertiesDef.vectorProperties._Color =
                  material.getBaseColorFactor();
              }

              if (material.getEmissiveFactor()) {
                materialPropertiesDef.vectorProperties._EmissionColor =
                  material.getEmissiveFactor();
              }

              if (materialMToon.getShadeColorFactor()) {
                materialPropertiesDef.vectorProperties._ShadeColor = [
                  ...materialMToon.getShadeColorFactor(),
                  1,
                ];
              }

              if (materialMToon.getParametricRimColorFactor()) {
                materialPropertiesDef.vectorProperties._RimColor = [
                  ...materialMToon.getParametricRimColorFactor(),
                  1,
                ];
              }

              if (materialMToon.getOutlineColorFactor()) {
                materialPropertiesDef.vectorProperties._OutlineColor = [
                  ...materialMToon.getOutlineColorFactor(),
                  1,
                ];
              }
            }
          });
      }

      rootDef.extensions[NAME] = vrmDef;
    }

    return this;
  }
}
