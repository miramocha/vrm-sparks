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

const NAME = VRM0;

export default class VRM0_vrm extends Extension {
  public readonly extensionName = NAME;
  public static readonly EXTENSION_NAME = NAME;

  public createMaterialProperty(): MaterialProperty {
    return new MaterialProperty(this.document.getGraph());
  }

  public read(context: ReaderContext): this {
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

      console.log("META", vrmJSON.meta);
      if (vrmJSON.meta) {
        vrm.setMeta(vrmJSON.meta);

        if (vrmJSON.meta.texture !== undefined) {
          const textureIndex = vrmJSON.meta.texture;
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

          if (texturePropertiesDef._MainTex !== undefined) {
            const textureIndex = texturePropertiesDef._MainTex;
            const texture = context.textures[texturePropertiesDef._MainTex];
            materialProperty.setMainTexture(texture);
            context.setTextureInfo(materialProperty.getMainTextureInfo()!, {
              index: textureIndex,
            });
          }

          if (texturePropertiesDef._ShadeTexture !== undefined) {
            const textureIndex = texturePropertiesDef._ShadeTexture;
            const texture =
              context.textures[texturePropertiesDef._ShadeTexture];
            materialProperty.setShadeTexture(texture);
            context.setTextureInfo(materialProperty.getShadeTextureInfo()!, {
              index: textureIndex,
            });
          }

          if (texturePropertiesDef._BumpMap !== undefined) {
            const textureIndex = texturePropertiesDef._BumpMap;
            const texture = context.textures[texturePropertiesDef._BumpMap];
            materialProperty.setBumpMapTexture(texture);
            context.setTextureInfo(materialProperty.getBumpMapTextureInfo()!, {
              index: textureIndex,
            });
          }

          if (texturePropertiesDef._EmissionMap !== undefined) {
            const textureIndex = texturePropertiesDef._EmissionMap;
            const texture = context.textures[texturePropertiesDef._EmissionMap];
            materialProperty.setEmissionMapTexture(texture);
            context.setTextureInfo(
              materialProperty.getEmissionMapTextureInfo()!,
              {
                index: textureIndex,
              }
            );
          }

          if (texturePropertiesDef._SphereAdd !== undefined) {
            const textureIndex = texturePropertiesDef._SphereAdd;
            const texture = context.textures[texturePropertiesDef._SphereAdd];
            materialProperty.setSphereAddTexture(texture);
            context.setTextureInfo(
              materialProperty.getSphereAddTextureInfo()!,
              {
                index: textureIndex,
              }
            );
          }

          if (texturePropertiesDef._RimTexture !== undefined) {
            const textureIndex = texturePropertiesDef._RimTexture;
            const texture = context.textures[texturePropertiesDef._RimTexture];
            materialProperty.setRimTexture(texture);
            context.setTextureInfo(materialProperty.getRimTextureInfo()!, {
              index: textureIndex,
            });
          }

          if (texturePropertiesDef._OutlineWidthTexture !== undefined) {
            const textureIndex = texturePropertiesDef._OutlineWidthTexture;
            const texture =
              context.textures[texturePropertiesDef._OutlineWidthTexture];
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

    console.log("JSON WRITE:", context.jsonDoc.json);
    console.log("TEXTURE JSON WRITE:", context.jsonDoc.json.textures);
    console.log("MATERIAL JSON WRITE:", context.jsonDoc.json.materials);
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
          vrmJSON.meta.texture = context.createTextureInfoDef(
            vrm.getThumbnailTexture()!,
            vrm.getThumbnailTextureInfo()!
          ).index;
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
            _MainTex: number | undefined;
            _ShadeTexture: number | undefined;
            _BumpMap: number | undefined;
            _EmissionMap: number | undefined;
            _SphereAdd: number | undefined;
            _RimTexture: number | undefined;
            _OutlineWidthexture: number | undefined;
          } = {
            _MainTex: undefined,
            _ShadeTexture: undefined,
            _BumpMap: undefined,
            _EmissionMap: undefined,
            _SphereAdd: undefined,
            _RimTexture: undefined,
            _OutlineWidthexture: undefined,
          };

          const materialProperty =
            material.getExtension<MaterialProperty>(NAME);

          if (materialProperty) {
            if (materialProperty.getMainTexture()) {
              texturePropertiesDef._MainTex = context.createTextureInfoDef(
                materialProperty.getMainTexture()!,
                materialProperty.getMainTextureInfo()!
              ).index;
            }

            if (materialProperty.getShadeTexture()) {
              texturePropertiesDef._ShadeTexture = context.createTextureInfoDef(
                materialProperty.getShadeTexture()!,
                materialProperty.getShadeTextureInfo()!
              ).index;
            }

            if (materialProperty.getBumpMapTexture()) {
              texturePropertiesDef._BumpMap = context.createTextureInfoDef(
                materialProperty.getBumpMapTexture()!,
                materialProperty.getBumpMapTextureInfo()!
              ).index;
            }

            if (materialProperty.getEmissionMapTexture()) {
              texturePropertiesDef._EmissionMap = context.createTextureInfoDef(
                materialProperty.getEmissionMapTexture()!,
                materialProperty.getEmissionMapTextureInfo()!
              ).index;
            }

            if (materialProperty.getSphereAddTexture()) {
              texturePropertiesDef._SphereAdd = context.createTextureInfoDef(
                materialProperty.getSphereAddTexture()!,
                materialProperty.getSphereAddTextureInfo()!
              ).index;
            }

            if (materialProperty.getRimTexture()) {
              texturePropertiesDef._RimTexture = context.createTextureInfoDef(
                materialProperty.getRimTexture()!,
                materialProperty.getRimTextureInfo()!
              ).index;
            }

            if (materialProperty.getOutlineWidthTexture()) {
              texturePropertiesDef._OutlineWidthexture =
                context.createTextureInfoDef(
                  materialProperty.getOutlineWidthTexture()!,
                  materialProperty.getOutlineWidthTextureInfo()!
                ).index;
            }

            materialPropertyDef.textureProperties = texturePropertiesDef;
          }
        });
      }
    }

    console.log("POST WRITE -> GLTF JSON", jsonDoc.json);

    return this;
  }
}
