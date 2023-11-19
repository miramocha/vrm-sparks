import {
  Extension,
  Material,
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
      this.document.getRoot().setExtension(NAME, vrm);

      const vrmJSON = context.jsonDoc.json.extensions[NAME] as VRM0Type.VRM;
      const unusedTextureIndexes = new Set<number>([
        ...Array(context.jsonDoc.json.textures?.length || 0).keys(),
      ]);

      context.jsonDoc.json.materials?.forEach((materialDef) => {
        console.log(materialDef);
        const baseTextureIndex =
          materialDef.pbrMetallicRoughness?.baseColorTexture?.index;
        const normalTextureIndex = materialDef.normalTexture?.index;
        const emissiveTextureIndex = materialDef.emissiveTexture?.index;

        if (baseTextureIndex !== undefined) {
          unusedTextureIndexes.delete(baseTextureIndex);
        }

        if (normalTextureIndex !== undefined) {
          unusedTextureIndexes.delete(normalTextureIndex);
        }

        if (emissiveTextureIndex !== undefined) {
          unusedTextureIndexes.delete(emissiveTextureIndex);
        }
      });

      console.log("UNUSED:", unusedTextureIndexes);
      unusedTextureIndexes.forEach((index) => {
        const texture = context.textures[index];
        const material = new Material(this.document.getRoot().getGraph());
        material.setBaseColorTexture(texture);
      });

      context.textures.forEach((texture) => {
        console.log(texture.getName(), texture.listParents());
      });

      if (vrmJSON.exporterVersion) {
        vrm.setExporterVersion(vrmJSON.exporterVersion as string);
      }

      if (vrmJSON.meta) {
        vrm.setMeta(vrmJSON.meta);
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

        // Fix GLTF material to stop transformer from deleting unused texture by assigning it
        vrmJSON.materialProperties.forEach((materialPropertyDef, index) => {
          const textureProperties = materialPropertyDef.textureProperties;
          const vectorProperties = materialPropertyDef.vectorProperties;

          if (textureProperties && vectorProperties) {
            const materialProperty = this.createMaterialProperty();
            const material = context.materials[index];

            if (textureProperties._MainTex !== undefined) {
              const textureIndex = textureProperties._MainTex;
              const texture = context.textures[textureProperties._MainTex];
              materialProperty.setMainTexture(texture);
              context.setTextureInfo(materialProperty.getMainTextureInfo()!, {
                index: textureIndex,
              });
            }

            if (textureProperties._ShadeTexture !== undefined) {
              const textureIndex = textureProperties._ShadeTexture;
              const texture = context.textures[textureProperties._ShadeTexture];
              materialProperty.setShadeTexture(texture);
              context.setTextureInfo(materialProperty.getShadeTextureInfo()!, {
                index: textureIndex,
              });
            }

            if (textureProperties._BumpMap !== undefined) {
              const textureIndex = textureProperties._BumpMap;
              const texture = context.textures[textureProperties._BumpMap];
              materialProperty.setBumpMapTexture(texture);
              context.setTextureInfo(
                materialProperty.getBumpMapTextureInfo()!,
                {
                  index: textureIndex,
                }
              );
            }

            if (textureProperties._EmissionMap !== undefined) {
              const textureIndex = textureProperties._EmissionMap;
              const texture = context.textures[textureProperties._EmissionMap];
              materialProperty.setEmissionMapTexture(texture);
              context.setTextureInfo(
                materialProperty.getEmissionMapTextureInfo()!,
                {
                  index: textureIndex,
                }
              );
            }

            if (textureProperties._SphereAdd !== undefined) {
              const textureIndex = textureProperties._SphereAdd;
              const texture = context.textures[textureProperties._SphereAdd];
              materialProperty.setSphereAddTexture(texture);
              context.setTextureInfo(
                materialProperty.getSphereAddTextureInfo()!,
                {
                  index: textureIndex,
                }
              );
            }

            if (textureProperties._RimTexture !== undefined) {
              const textureIndex = textureProperties._RimTexture;
              const texture = context.textures[textureProperties._RimTexture];
              materialProperty.setRimTexture(texture);
              context.setTextureInfo(materialProperty.getRimTextureInfo()!, {
                index: textureIndex,
              });
            }

            material.setExtension(NAME, materialProperty);
          }
        });
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
        vrmJSON.meta = vrm.getMeta();
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
          } = {
            _MainTex: undefined,
            _ShadeTexture: undefined,
            _BumpMap: undefined,
            _EmissionMap: undefined,
            _SphereAdd: undefined,
            _RimTexture: undefined,
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

            materialPropertyDef.textureProperties = texturePropertiesDef;

            console.log("WRITE MAT PROP", materialPropertyDef);
          }
        });
      }
    }

    console.log("POST WRITE -> GLTF JSON", jsonDoc.json);

    return this;
  }
}
