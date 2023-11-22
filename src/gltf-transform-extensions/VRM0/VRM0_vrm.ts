import {
  Extension,
  // Material,
  ReaderContext,
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
            const materialProperties = this.createMaterialProperties();
            const material = context.materials[materialPropertiesDefIndex];
            material.setExtension(NAME, materialProperties);

            const texturePropertiesDef =
              materialPropertiesDef.textureProperties || {};

            // Textures
            if (texturePropertiesDef) {
              if (texturePropertiesDef._MainTex !== undefined) {
                const texture =
                  context.textures[
                    textureDefs[texturePropertiesDef._MainTex].source!
                  ];
                materialProperties.setMainTexture(texture);
                context.setTextureInfo(
                  materialProperties.getMainTextureInfo()!,
                  {
                    index: texturePropertiesDef._MainTex,
                  }
                );
              }

              if (texturePropertiesDef._ShadeTexture !== undefined) {
                const texture =
                  context.textures[
                    textureDefs[texturePropertiesDef._ShadeTexture].source!
                  ];
                materialProperties.setShadeTexture(texture);
                context.setTextureInfo(
                  materialProperties.getShadeTextureInfo()!,
                  {
                    index: texturePropertiesDef._ShadeTexture,
                  }
                );
              }

              if (texturePropertiesDef._BumpMap !== undefined) {
                const texture =
                  context.textures[
                    textureDefs[texturePropertiesDef._BumpMap].source!
                  ];
                materialProperties.setBumpMapTexture(texture);
                context.setTextureInfo(
                  materialProperties.getBumpMapTextureInfo()!,
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
                materialProperties.setEmissionMapTexture(texture);
                context.setTextureInfo(
                  materialProperties.getEmissionMapTextureInfo()!,
                  {
                    index: texturePropertiesDef._EmissionMap,
                  }
                );
              }

              if (texturePropertiesDef._SphereAdd !== undefined) {
                const texture =
                  context.textures[
                    textureDefs[texturePropertiesDef._SphereAdd].source!
                  ];
                materialProperties.setSphereAddTexture(texture);
                context.setTextureInfo(
                  materialProperties.getSphereAddTextureInfo()!,
                  {
                    index: texturePropertiesDef._SphereAdd,
                  }
                );
              }

              if (texturePropertiesDef._RimTexture !== undefined) {
                const texture =
                  context.textures[
                    textureDefs[texturePropertiesDef._RimTexture].source!
                  ];
                materialProperties.setRimTexture(texture);
                context.setTextureInfo(
                  materialProperties.getRimTextureInfo()!,
                  {
                    index: texturePropertiesDef._RimTexture,
                  }
                );
              }

              if (texturePropertiesDef._OutlineWidthTexture !== undefined) {
                const texture =
                  context.textures[
                    textureDefs[texturePropertiesDef._OutlineWidthTexture]
                      .source!
                  ];
                materialProperties.setOutlineWidthTexture(texture);
                context.setTextureInfo(
                  materialProperties.getOutlineWidthTextureInfo()!,
                  {
                    index: texturePropertiesDef._OutlineWidthTexture,
                  }
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
            const materialProperties =
              material.getExtension<MaterialProperties>(NAME);
            const materialPropertiesDef =
              vrmDef.materialProperties![materialIndex];

            if (materialProperties && materialPropertiesDef) {
              materialPropertiesDef.textureProperties =
                materialPropertiesDef.textureProperties || {};

              if (materialProperties.getMainTexture()) {
                const texture = materialProperties.getMainTexture()!;
                const textureInfo = materialProperties.getMainTextureInfo()!;
                materialPropertiesDef.textureProperties._MainTex =
                  context.createTextureInfoDef(texture, textureInfo).index;
              }

              if (materialProperties.getShadeTexture()) {
                const texture = materialProperties.getShadeTexture()!;
                const textureInfo = materialProperties.getShadeTextureInfo()!;
                materialPropertiesDef.textureProperties._ShadeTexture =
                  context.createTextureInfoDef(texture, textureInfo).index;
              }

              if (materialProperties.getBumpMapTexture()) {
                const texture = materialProperties.getBumpMapTexture()!;
                const textureInfo = materialProperties.getBumpMapTextureInfo()!;
                materialPropertiesDef.textureProperties._BumpMap =
                  context.createTextureInfoDef(texture, textureInfo).index;
              }

              if (materialProperties.getEmissionMapTexture()) {
                const texture = materialProperties.getEmissionMapTexture()!;
                const textureInfo =
                  materialProperties.getEmissionMapTextureInfo()!;
                materialPropertiesDef.textureProperties._EmissionMap =
                  context.createTextureInfoDef(texture, textureInfo).index;
              }

              if (materialProperties.getSphereAddTexture()) {
                const texture = materialProperties.getSphereAddTexture()!;
                const textureInfo =
                  materialProperties.getSphereAddTextureInfo()!;
                materialPropertiesDef.textureProperties._SphereAdd =
                  context.createTextureInfoDef(texture, textureInfo).index;
              }

              if (materialProperties.getRimTexture()) {
                const texture = materialProperties.getRimTexture()!;
                const textureInfo = materialProperties.getRimTextureInfo()!;
                materialPropertiesDef.textureProperties._RimTexture =
                  context.createTextureInfoDef(texture, textureInfo).index;
              }

              if (materialProperties.getOutlineWidthTexture()) {
                const texture = materialProperties.getOutlineWidthTexture()!;
                const textureInfo =
                  materialProperties.getOutlineWidthTextureInfo()!;
                materialPropertiesDef.textureProperties._OutlineWidthTexture =
                  context.createTextureInfoDef(texture, textureInfo).index;
              }
            }
          });
      }

      rootDef.extensions[NAME] = vrmDef;
    }

    return this;
  }
}
