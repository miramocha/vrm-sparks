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
    console.log(
      textureIndex + " texture def:",
      context.jsonDoc.json.textures[textureIndex]
    );
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

    if (
      context.jsonDoc.json.extensions &&
      context.jsonDoc.json.extensions[NAME]
    ) {
      console.log("JSON READ:", context.jsonDoc.json);
      console.log("TEXTURE JSON READ:", context.jsonDoc.json.textures);
      console.log("MATERIAL JSON READ:", context.jsonDoc.json.materials);
      const vrm = new VRM(this.document.getGraph());

      try {
        this.document.getRoot().setExtension(NAME, vrm);
        console.log("EXTENSION SET");
      } catch (error) {
        console.log("EXTENSION SET FAILED");
        console.error(error);
      }

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

          console.log("----CHECKING----", material.getName());

          console.log("----MAIN----");
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

          console.log("----SHADE----");
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

        console.log("uniquepropnames", texturePropsNames);
      }
    }

    return this;
  }

  public write(context: WriterContext): this {
    const jsonDoc = context.jsonDoc;
    const vrm = this.document.getRoot().getExtension<VRM>(NAME);

    console.log("TEXTURE JSON WRITE:", context.jsonDoc.json.textures);
    console.log("MATERIAL JSON WRITE:", context.jsonDoc.json.materials);
    console.log("IMAGE JSON WRITE:", context.jsonDoc.json.images);
    if (vrm) {
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
          const newIndex = context.createTextureInfoDef(
            vrm.getThumbnailTexture()!,
            vrm.getThumbnailTextureInfo()!
          ).index;

          console.log(
            "thumbnail index changed from " +
              vrmJSON.meta.texture +
              " to " +
              newIndex
          );
          vrmJSON.meta.texture = newIndex;
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
              const newIndex = context.createTextureInfoDef(
                materialProperty.getMainTexture()!,
                materialProperty.getMainTextureInfo()!
              ).index;
              texturePropertiesDef._MainTex = newIndex;
            }

            if (materialProperty.getShadeTexture()) {
              const newIndex = context.createTextureInfoDef(
                materialProperty.getShadeTexture()!,
                materialProperty.getShadeTextureInfo()!
              ).index;

              texturePropertiesDef._ShadeTexture = newIndex;
            }

            if (materialProperty.getBumpMapTexture()) {
              const newIndex = context.createTextureInfoDef(
                materialProperty.getBumpMapTexture()!,
                materialProperty.getBumpMapTextureInfo()!
              ).index;
              texturePropertiesDef._BumpMap = newIndex;
            }

            if (materialProperty.getEmissionMapTexture()) {
              const newIndex = context.createTextureInfoDef(
                materialProperty.getEmissionMapTexture()!,
                materialProperty.getEmissionMapTextureInfo()!
              ).index;
              texturePropertiesDef._EmissionMap = newIndex;
            }

            if (materialProperty.getSphereAddTexture()) {
              const newIndex = context.createTextureInfoDef(
                materialProperty.getSphereAddTexture()!,
                materialProperty.getSphereAddTextureInfo()!
              ).index;
              texturePropertiesDef._SphereAdd = newIndex;
            }

            if (materialProperty.getRimTexture()) {
              const newIndex = context.createTextureInfoDef(
                materialProperty.getRimTexture()!,
                materialProperty.getRimTextureInfo()!
              ).index;
              texturePropertiesDef._RimTexture = newIndex;
            }

            if (materialProperty.getOutlineWidthTexture()) {
              const newIndex = context.createTextureInfoDef(
                materialProperty.getOutlineWidthTexture()!,
                materialProperty.getOutlineWidthTextureInfo()!
              ).index;
              texturePropertiesDef._OutlineWidthexture = newIndex;
            }

            console.log("WRITING ON OLD MAT PROP", materialPropertyDef);

            materialPropertyDef.textureProperties = texturePropertiesDef;
          }
        });
      }
    }

    console.log("POST WRITE -> GLTF JSON", jsonDoc.json);

    return this;
  }
}
