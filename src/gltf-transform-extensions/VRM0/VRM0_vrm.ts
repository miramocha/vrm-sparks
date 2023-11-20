import {
  Extension,
  // Material,
  ReaderContext,
  WriterContext,
} from "@gltf-transform/core";
import * as VRM0Type from "@pixiv/types-vrm-0.0";
import VRM from "./VRM.ts";
import { VRM0 } from "./constants.ts";
import MaterialProperty from "./materialProperty.ts";
// import { texture } from "three/examples/jsm/nodes/Nodes.js";

const NAME = VRM0;

function getVRM0TextureIndex(
  context: ReaderContext,
  textureIndex: number
): number {
  if (context.jsonDoc.json.textures) {
    const normalizedTextureIndex =
      context.jsonDoc.json.textures[textureIndex].source;

    if (textureIndex !== normalizedTextureIndex) {
      console.log(
        `TEXTURE OFFSET DETECTED: ${textureIndex} -> ${normalizedTextureIndex}`
      );

      if (normalizedTextureIndex) {
        // console.log(
        //   `CHECKING IMAGE: ${
        //     context.textures[normalizedTextureIndex]
        //       ? context.textures[normalizedTextureIndex].getName()
        //       : null
        //   }`
        // );

        return normalizedTextureIndex;
      }
    }
  }

  return textureIndex;
}

export default class VRM0_vrm extends Extension {
  public readonly extensionName = NAME;
  public static readonly EXTENSION_NAME = NAME;

  public createMaterialProperty(): MaterialProperty {
    return new MaterialProperty(this.document.getGraph());
  }

  public read(context: ReaderContext): this {
    console.log("READ TEXTURES", context.textures);

    console.log("READ TEXTURE INFOS", context.textureInfos);
    // console.log("READ MATERIALS", context.materials);

    if (
      context.jsonDoc.json.extensions &&
      context.jsonDoc.json.extensions[NAME]
    ) {
      console.log("JSON READ:", context.jsonDoc.json);
      console.log("TEXTURE JSON READ:", context.jsonDoc.json.textures);
      console.log("MATERIAL JSON READ:", context.jsonDoc.json.materials);
      const vrm = new VRM(this.document.getGraph());

      this.document.getRoot().setExtension(NAME, vrm);

      const vrmJSON = context.jsonDoc.json.extensions[NAME] as VRM0Type.VRM;
      console.log("VRM JSON", vrmJSON);

      if (vrmJSON.exporterVersion) {
        vrm.setExporterVersion(vrmJSON.exporterVersion as string);
      }

      if (vrmJSON.meta) {
        vrm.setMeta(vrmJSON.meta);

        if (vrmJSON.meta.texture !== undefined) {
          const textureIndex = getVRM0TextureIndex(
            context,
            vrmJSON.meta.texture
          );
          const texture = context.textures[vrmJSON.meta.texture];

          if (texture) {
            vrm.setThumbnailTexture(texture);
            context.setTextureInfo(vrm.getThumbnailTextureInfo()!, {
              index: textureIndex,
            });
          }
        }
      }

      console.info("READING HUMANOID");
      if (vrmJSON.humanoid) {
        vrm.setHumanoid(vrmJSON.humanoid);
      }

      if (vrmJSON.firstPerson) {
        vrm.setFirstPerson(vrmJSON.firstPerson);
      }

      if (vrmJSON.blendShapeMaster) {
        vrm.setBlendShapeMaster(vrmJSON.blendShapeMaster);
      }

      if (vrmJSON.secondaryAnimation) {
        vrm.setSecondaryAnimation(vrmJSON.secondaryAnimation);
      }

      console.info("READING MATERIAL PROPERTIES");
      if (vrmJSON.materialProperties) {
        vrm.setMaterialProperties(vrmJSON.materialProperties);

        const texturePropsNames = new Set<string>();

        vrmJSON.materialProperties.forEach((materialPropertyDef, index) => {
          const texturePropertiesDef =
            materialPropertyDef.textureProperties || {};

          if (materialPropertyDef.textureProperties) {
            Object.keys(materialPropertyDef.textureProperties).forEach(
              (key) => {
                texturePropsNames.add(key);
              }
            );
          }

          const materialProperty = this.createMaterialProperty();
          const material = context.materials[index];

          if (materialPropertyDef.name === "v10_body") {
            console.log("READ -> BODY", materialPropertyDef.textureProperties);
          }

          if (texturePropertiesDef._MainTex !== undefined) {
            const textureIndex = getVRM0TextureIndex(
              context,
              texturePropertiesDef._MainTex
            );

            const texture = context.textures[textureIndex];
            materialProperty.setMainTexture(texture);
            context.setTextureInfo(materialProperty.getMainTextureInfo()!, {
              index: textureIndex,
            });
          }

          if (texturePropertiesDef._ShadeTexture !== undefined) {
            const textureIndex = getVRM0TextureIndex(
              context,
              texturePropertiesDef._ShadeTexture
            );
            const texture = context.textures[textureIndex];
            materialProperty.setShadeTexture(texture);
            context.setTextureInfo(materialProperty.getShadeTextureInfo()!, {
              index: textureIndex,
            });
          }

          if (texturePropertiesDef._BumpMap !== undefined) {
            const textureIndex = getVRM0TextureIndex(
              context,
              texturePropertiesDef._BumpMap
            );
            const texture = context.textures[textureIndex];
            materialProperty.setBumpMapTexture(texture);
            context.setTextureInfo(materialProperty.getBumpMapTextureInfo()!, {
              index: textureIndex,
            });
          }

          if (texturePropertiesDef._EmissionMap !== undefined) {
            const textureIndex = getVRM0TextureIndex(
              context,
              texturePropertiesDef._EmissionMap
            );
            const texture = context.textures[textureIndex];
            materialProperty.setEmissionMapTexture(texture);
            context.setTextureInfo(
              materialProperty.getEmissionMapTextureInfo()!,
              {
                index: textureIndex,
              }
            );
          }

          if (texturePropertiesDef._SphereAdd !== undefined) {
            const textureIndex = getVRM0TextureIndex(
              context,
              texturePropertiesDef._SphereAdd
            );
            const texture = context.textures[textureIndex];
            materialProperty.setSphereAddTexture(texture);
            context.setTextureInfo(
              materialProperty.getSphereAddTextureInfo()!,
              {
                index: textureIndex,
              }
            );
          }

          if (texturePropertiesDef._RimTexture !== undefined) {
            const textureIndex = getVRM0TextureIndex(
              context,
              texturePropertiesDef._RimTexture
            );
            const texture = context.textures[textureIndex];
            materialProperty.setRimTexture(texture);
            context.setTextureInfo(materialProperty.getRimTextureInfo()!, {
              index: textureIndex,
            });
          }

          if (texturePropertiesDef._OutlineWidthTexture !== undefined) {
            const textureIndex = getVRM0TextureIndex(
              context,
              texturePropertiesDef._OutlineWidthTexture
            );
            const texture = context.textures[textureIndex];
            materialProperty.setOutlineWidthTexture(texture);
            context.setTextureInfo(
              materialProperty.getOutlineWidthTextureInfo()!,
              {
                index: textureIndex,
              }
            );
          }

          material.setExtension(NAME, materialProperty);
        });
      }
    }

    console.log(
      "texture with one parent",
      context.textures
        .filter((tex) => {
          tex.listParents().length > 1;
        })
        .map((tex) => tex.getName)
    );

    return this;
  }

  public write(context: WriterContext): this {
    const jsonDoc = context.jsonDoc;
    const vrm = this.document.getRoot().getExtension<VRM>(NAME);

    console.log("WRITE -> TEXTURE DEF INDEX MAP", context.textureDefIndexMap);

    console.log("TEXTURE JSON WRITE:", context.jsonDoc.json.textures);
    console.log("MATERIAL JSON WRITE:", context.jsonDoc.json.materials);
    console.log("IMAGE JSON WRITE:", context.jsonDoc.json.images);

    const texturesDef = context.jsonDoc.json.textures;

    if (vrm && texturesDef) {
      const vrmJSON = {} as VRM0Type.VRM;
      const rootDef = jsonDoc.json;
      rootDef.extensions = rootDef.extensions || {};

      vrmJSON.specVersion = "0.0";

      if (vrm.getExporterVersion()) {
        vrmJSON.exporterVersion = vrm.getExporterVersion();
      }

      if (vrm.getMeta()) {
        vrmJSON.meta = vrm.getMeta() || {};

        if (vrm.getThumbnailTexture()) {
          const imageIndex = context.imageIndexMap.get(
            vrm.getThumbnailTexture()!
          );

          const textureIndex = texturesDef.findIndex(
            (textureDef) => textureDef.source === imageIndex
          );

          if (textureIndex === -1) {
            console.log(imageIndex + " not found in textureDef");
          }

          vrmJSON.meta.texture = textureIndex === -1 ? undefined : textureIndex;
        }
      }

      if (vrm.getHumanoid()) {
        vrmJSON.humanoid = vrm.getHumanoid();
      }

      if (vrm.getFirstPerson()) {
        vrmJSON.firstPerson = vrm.getFirstPerson();
      }

      if (vrm.getBlendShapeMaster()) {
        vrmJSON.blendShapeMaster = vrm.getBlendShapeMaster();
      }

      if (vrm.getSecondaryAnimation()) {
        vrmJSON.secondaryAnimation = vrm.getSecondaryAnimation();
      }

      if (vrm.getMaterialProperties()) {
        vrmJSON.materialProperties = vrm.getMaterialProperties();
      }

      rootDef.extensions[NAME] = vrmJSON;

      if (vrm.getMaterialProperties()) {
        vrm.getMaterialProperties()?.forEach((materialPropertyDef, index) => {
          const material = this.document.getRoot().listMaterials()[index];

          if (materialPropertyDef.name === "v10_body") {
            console.log("WRITE -> BODY", materialPropertyDef.textureProperties);
          }

          const texturePropertiesDef: {
            _MainTex?: number | undefined;
            _ShadeTexture?: number | undefined;
            _BumpMap?: number | undefined;
            _EmissionMap?: number | undefined;
            _SphereAdd?: number | undefined;
            _RimTexture?: number | undefined;
            _OutlineWidthexture?: number | undefined;
          } = {};

          const materialProperty =
            material.getExtension<MaterialProperty>(NAME);

          if (materialProperty) {
            if (materialProperty.getMainTexture()) {
              // const imageIndex = context.createTextureInfoDef(
              //   materialProperty.getMainTexture()!,
              //   materialProperty.getMainTextureInfo()!
              // ).index;
              const imageIndex = context.imageIndexMap.get(
                materialProperty.getMainTexture()!
              );

              const textureIndex = texturesDef.findIndex(
                (textureDef) => textureDef.source === imageIndex
              );

              if (textureIndex === -1) {
                console.log(imageIndex + " not found in textureDef");
              }

              texturePropertiesDef._MainTex =
                textureIndex === -1 ? undefined : textureIndex;
            }

            if (materialProperty.getShadeTexture()) {
              // const imageIndex = context.createTextureInfoDef(
              //   materialProperty.getShadeTexture()!,
              //   materialProperty.getShadeTextureInfo()!
              // ).index;
              const imageIndex = context.imageIndexMap.get(
                materialProperty.getShadeTexture()!
              );

              const textureIndex = texturesDef.findIndex(
                (textureDef) => textureDef.source === imageIndex
              );

              if (textureIndex === -1) {
                console.log(imageIndex + " not found in textureDef");
              }

              texturePropertiesDef._ShadeTexture =
                textureIndex === -1 ? undefined : textureIndex;
            }

            if (materialProperty.getBumpMapTexture()) {
              // const imageIndex = context.createTextureInfoDef(
              //   materialProperty.getBumpMapTexture()!,
              //   materialProperty.getBumpMapTextureInfo()!
              // ).index;
              const imageIndex = context.imageIndexMap.get(
                materialProperty.getBumpMapTexture()!
              );

              const textureIndex = texturesDef.findIndex(
                (textureDef) => textureDef.source === imageIndex
              );

              if (textureIndex === -1) {
                console.log(imageIndex + " not found in textureDef");
              }

              texturePropertiesDef._BumpMap =
                textureIndex === -1 ? undefined : textureIndex;
            }

            if (materialProperty.getEmissionMapTexture()) {
              // const imageIndex = context.createTextureInfoDef(
              //   materialProperty.getEmissionMapTexture()!,
              //   materialProperty.getEmissionMapTextureInfo()!
              // ).index;

              const imageIndex = context.imageIndexMap.get(
                materialProperty.getEmissionMapTexture()!
              );

              const textureIndex = texturesDef.findIndex(
                (textureDef) => textureDef.source === imageIndex
              );

              if (textureIndex === -1) {
                console.log(imageIndex + " not found in textureDef");
              }

              texturePropertiesDef._EmissionMap =
                textureIndex === -1 ? undefined : textureIndex;
            }

            if (materialProperty.getSphereAddTexture()) {
              // const imageIndex = context.createTextureInfoDef(
              //   materialProperty.getSphereAddTexture()!,
              //   materialProperty.getSphereAddTextureInfo()!
              // ).index;

              const imageIndex = context.imageIndexMap.get(
                materialProperty.getSphereAddTexture()!
              );

              const textureIndex = texturesDef.findIndex(
                (textureDef) => textureDef.source === imageIndex
              );

              if (textureIndex === -1) {
                console.log(imageIndex + " not found in textureDef");
              }

              texturePropertiesDef._SphereAdd =
                textureIndex === -1 ? undefined : textureIndex;
            }

            if (materialProperty.getRimTexture()) {
              // const imageIndex = context.createTextureInfoDef(
              //   materialProperty.getRimTexture()!,
              //   materialProperty.getRimTextureInfo()!
              // ).index;

              const imageIndex = context.imageIndexMap.get(
                materialProperty.getRimTexture()!
              );

              const textureIndex = texturesDef.findIndex(
                (textureDef) => textureDef.source === imageIndex
              );

              if (textureIndex === -1) {
                console.log(imageIndex + " not found in textureDef");
              }

              texturePropertiesDef._RimTexture =
                textureIndex === -1 ? undefined : textureIndex;
            }

            if (materialProperty.getOutlineWidthTexture()) {
              // const imageIndex = context.createTextureInfoDef(
              //   materialProperty.getOutlineWidthTexture()!,
              //   materialProperty.getOutlineWidthTextureInfo()!
              // ).index;

              const imageIndex = context.imageIndexMap.get(
                materialProperty.getOutlineWidthTexture()!
              );

              const textureIndex = texturesDef.findIndex(
                (textureDef) => textureDef.source === imageIndex
              );

              if (textureIndex === -1) {
                console.log(imageIndex + " not found in textureDef");
              }

              texturePropertiesDef._OutlineWidthexture =
                textureIndex === -1 ? undefined : textureIndex;
            }

            console.log("WRITING ON OLD MAT PROP", materialPropertyDef);

            materialPropertyDef.textureProperties = texturePropertiesDef;
          }

          if (materialPropertyDef.name === "v10_body") {
            console.log(
              "POSTWRITE -> BODY",
              materialPropertyDef.textureProperties
            );
          }
        });
      }
    }

    console.log("POST WRITE -> GLTF JSON", jsonDoc.json);

    return this;
  }
}
