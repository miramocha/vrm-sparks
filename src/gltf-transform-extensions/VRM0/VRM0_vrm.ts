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

// function getVRM0TextureIndex(
//   context: ReaderContext,
//   textureIndex: number
// ): number {
//   if (context.jsonDoc.json.textures) {
//     const normalizedTextureIndex =
//       context.jsonDoc.json.textures[textureIndex].source;

//     if (textureIndex !== normalizedTextureIndex) {
//       console.log(
//         `TEXTURE OFFSET DETECTED: ${textureIndex} -> ${normalizedTextureIndex}`
//       );

//       // if (normalizedTextureIndex) {
//       //   return normalizedTextureIndex;
//       // }
//     }
//   }

//   return textureIndex;
// }

export default class VRM0_vrm extends Extension {
  public readonly extensionName = NAME;
  public static readonly EXTENSION_NAME = NAME;

  public createMaterialProperty(): MaterialProperty {
    return new MaterialProperty(this.document.getGraph());
  }

  public read(context: ReaderContext): this {
    console.log("READ TEXTURES", context.textures);
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

      if (vrmJSON.exporterVersion) {
        vrm.setExporterVersion(vrmJSON.exporterVersion as string);
      }

      if (vrmJSON.meta) {
        vrm.setMeta(vrmJSON.meta);

        if (vrmJSON.meta.texture !== undefined) {
          console.log("SET META TEXTURE");
        }
      }

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

      if (vrmJSON.materialProperties) {
        vrm.setMaterialProperties(vrmJSON.materialProperties);

        vrmJSON.materialProperties.forEach(
          (materialPropertiesDef, materialPropertiesDefIndex) => {
            const texturePropertiesDef =
              materialPropertiesDef.textureProperties || {};
            const materialProperty = this.createMaterialProperty();

            if (texturePropertiesDef._MainTex !== undefined) {
            }

            if (texturePropertiesDef._ShadeTexture !== undefined) {
            }

            if (texturePropertiesDef._BumpMap !== undefined) {
            }

            if (texturePropertiesDef._EmissionMap !== undefined) {
            }

            if (texturePropertiesDef._SphereAdd !== undefined) {
            }

            if (texturePropertiesDef._RimTexture !== undefined) {
            }

            if (texturePropertiesDef._OutlineWidthTexture !== undefined) {
            }

            material.setExtension(NAME, materialProperty);
          }
        );
      }
    }

    return this;
  }

  public write(context: WriterContext): this {
    const jsonDoc = context.jsonDoc;
    const vrm = this.document.getRoot().getExtension<VRM>(NAME);

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

              texturePropertiesDef._MainTex = imageIndex;
              // textureIndex === -1 ? undefined : textureIndex;
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

              texturePropertiesDef._ShadeTexture = imageIndex;
              // textureIndex === -1 ? undefined : textureIndex;
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

              texturePropertiesDef._BumpMap = imageIndex;
              // textureIndex === -1 ? undefined : textureIndex;
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

              texturePropertiesDef._EmissionMap = imageIndex;
              // textureIndex === -1 ? undefined : textureIndex;
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

              texturePropertiesDef._SphereAdd = imageIndex;
              // textureIndex === -1 ? undefined : textureIndex;
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

              texturePropertiesDef._RimTexture = imageIndex;
              // textureIndex === -1 ? undefined : textureIndex;
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

              texturePropertiesDef._OutlineWidthexture = imageIndex;
              // textureIndex === -1 ? undefined : textureIndex;
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
