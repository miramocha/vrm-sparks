import {
  Extension,
  ReaderContext,
  TextureInfo,
  WriterContext,
} from "@gltf-transform/core";
import * as VRM0Def from "@pixiv/types-vrm-0.0";
import VRM0Prop from "./properties/vrm0-vrm-prop.ts";
import { VRM0 as NAME } from "./constants.ts";
import VRM0MaterialMToonProp from "./properties/vrm0-material-mtoon-prop.ts";
import VRM0MetaProp from "./properties/vrm0-meta-prop.ts";

type LicenseName =
  | "Redistribution_Prohibited"
  | "CC0"
  | "CC_BY"
  | "CC_BY_NC"
  | "CC_BY_SA"
  | "CC_BY_NC_SA"
  | "CC_BY_ND"
  | "CC_BY_NC_ND"
  | "Other";

export default class VRM0VRM extends Extension {
  static readonly LICENSE_TO_URL_MAP = new Map<LicenseName, string>([
    ["CC0", "https://creativecommons.org/public-domain/cc0/"],
    ["CC_BY", "https://creativecommons.org/licenses/by/2.0/deed"],
    ["CC_BY_NC", "https://creativecommons.org/licenses/by-nc/2.0/deed"],
    ["CC_BY_SA", "https://creativecommons.org/licenses/by-sa/2.0/deed"],
    ["CC_BY_NC_SA", "https://creativecommons.org/licenses/by-nc-sa/2.0/deed"],
    ["CC_BY_ND", "https://creativecommons.org/licenses/by-nd/2.0/deed"],
    ["CC_BY_NC_ND", "https://creativecommons.org/licenses/by-nc-nd/2.0/deed"],
  ]);
  static readonly URL_TO_LICENSE_MAP = new Map<string, LicenseName>([
    ["https://creativecommons.org/public-domain/cc0/", "CC0"],
    ["https://creativecommons.org/licenses/by/2.0/deed", "CC_BY"],
    ["https://creativecommons.org/licenses/by-nc/2.0/deed", "CC_BY_NC"],
    ["https://creativecommons.org/licenses/by-sa/2.0/deed", "CC_BY_SA"],
    ["https://creativecommons.org/licenses/by-nc-sa/2.0/deed", "CC_BY_NC_SA"],
    ["https://creativecommons.org/licenses/by-nd/2.0/deed", "CC_BY_ND"],
    ["https://creativecommons.org/licenses/by-nc-nd/2.0/deed", "CC_BY_NC_ND"],
  ]);

  public createVRM0MetaProp(): VRM0MetaProp {
    return new VRM0MetaProp(this.document.getGraph());
  }

  public createVRM0MaterialMToonProp(): VRM0MaterialMToonProp {
    return new VRM0MaterialMToonProp(this.document.getGraph());
  }

  public read(context: ReaderContext): this {
    const jsonDoc = context.jsonDoc;

    if (jsonDoc.json.extensions && jsonDoc.json.extensions[NAME]) {
      const vrmDef = jsonDoc.json.extensions[NAME] as VRM0Def.VRM;
      const textureDefs = jsonDoc.json.textures || [];

      const vrmProp = new VRM0Prop(this.document.getGraph());
      this.document.getRoot().setExtension(NAME, vrmProp);

      if (vrmDef.exporterVersion) {
        vrmProp.setExporterVersion(vrmDef.exporterVersion as string);
      }

      if (vrmDef.meta) {
        const vrmMetaProp = this.createVRM0MetaProp();
        vrmProp.setMetaProp(vrmMetaProp);
        const metaDef = vrmDef.meta;

        if (metaDef.title !== undefined) {
          vrmMetaProp.setName(metaDef.title);
        }
        if (metaDef.version !== undefined) {
          vrmMetaProp.setVersion(metaDef.version);
        }
        if (metaDef.author !== undefined) {
          vrmMetaProp.setAuthors([metaDef.author]);
        }
        if (metaDef.contactInformation !== undefined) {
          vrmMetaProp.setContactInformation(metaDef.contactInformation);
        }
        if (metaDef.reference !== undefined) {
          vrmMetaProp.setReferences([metaDef.reference]);
        }
        if (metaDef.texture !== undefined) {
          const texture =
            context.textures[textureDefs[metaDef.texture].source!];
          vrmMetaProp.setThumbnailImageTexture(texture);
          context.setTextureInfo(vrmMetaProp.getThumbnailImageTextureInfo()!, {
            index: metaDef.texture,
          });
        }
        if (metaDef.allowedUserName !== undefined) {
          if (metaDef.allowedUserName === "ExplicitlyLicensedPerson") {
            vrmMetaProp.setAvatarPermission("onlySeparatelyLicensedPerson");
          } else if (metaDef.allowedUserName === "OnlyAuthor") {
            vrmMetaProp.setAvatarPermission("onlyAuthor");
          } else if (metaDef.allowedUserName === "Everyone") {
            vrmMetaProp.setAvatarPermission("everyone");
          }
        }
        if (metaDef.violentUssageName !== undefined) {
          vrmMetaProp.setAllowExcessivelyViolentUsage(
            metaDef.violentUssageName === "Allow"
          );
        }
        if (metaDef.sexualUssageName !== undefined) {
          vrmMetaProp.setAllowExcessivelySexualUsage(
            metaDef.sexualUssageName === "Allow"
          );
        }
        if (metaDef.commercialUssageName !== undefined) {
          if (metaDef.commercialUssageName === "Allow") {
            vrmMetaProp.setCommercialUsage("personalProfit");
          }
          if (metaDef.commercialUssageName === "Disallow") {
            vrmMetaProp.setCommercialUsage("personalNonProfit");
          }
          // Not sure about corporation commercial usage in VRM0. Will disallow for now if it's converted to VRM1
        }
        if (metaDef.licenseName !== undefined) {
          vrmMetaProp.setAllowRedistribution(
            metaDef.licenseName !== "Redistribution_Prohibited"
          );

          vrmMetaProp.setLicenseUrl(
            VRM0VRM.LICENSE_TO_URL_MAP.get(metaDef.licenseName)!
          );
        }
        if (metaDef.otherLicenseUrl !== undefined) {
          vrmMetaProp.setOtherLicenseUrl(metaDef.otherLicenseUrl);
        }
      }

      if (vrmDef.humanoid) {
        vrmProp.setHumanoid(vrmDef.humanoid);
      }

      if (vrmDef.firstPerson) {
        vrmProp.setFirstPerson(vrmDef.firstPerson);
      }

      if (vrmDef.blendShapeMaster) {
        vrmProp.setBlendShapeMaster(vrmDef.blendShapeMaster);
      }

      if (vrmDef.secondaryAnimation) {
        vrmProp.setSecondaryAnimation(vrmDef.secondaryAnimation);
      }

      if (vrmDef.materialProperties) {
        vrmProp.setMaterialProperties(vrmDef.materialProperties);

        vrmDef.materialProperties.forEach(
          (
            materialPropertiesDef: VRM0Def.Material,
            materialPropertiesDefIndex: number
          ) => {
            const materialMToon = this.createVRM0MaterialMToonProp();
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
              material.setBaseColorFactor(vectorPropertiesDef._Color);
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

    const vrmProp = this.document.getRoot().getExtension<VRM0Prop>(NAME);

    if (vrmProp) {
      const vrmDef = {} as VRM0Def.VRM;
      const rootDef = jsonDoc.json;
      rootDef.extensions = rootDef.extensions || {};

      vrmDef.specVersion = "0.0";

      if (vrmProp.getExporterVersion()) {
        vrmDef.exporterVersion = "VRM-Sparks 0.0";
      }

      const vrmMetaProp = vrmProp.getMetaProp();
      vrmDef.meta = vrmDef.meta || {};

      if (vrmMetaProp !== null) {
        const metaDef = vrmDef.meta;

        if (vrmMetaProp.getName() !== undefined) {
          metaDef.title = vrmMetaProp.getName();
        }
        if (vrmMetaProp.getVersion() !== undefined) {
          metaDef.version = vrmMetaProp.getVersion();
        }
        if (vrmMetaProp.getAuthors() !== undefined) {
          metaDef.author = vrmMetaProp.getAuthors().join(",");
        }
        if (vrmMetaProp.getContactInformation() !== undefined) {
          metaDef.contactInformation = vrmMetaProp.getContactInformation();
        }
        if (vrmMetaProp.getReferences() !== undefined) {
          metaDef.reference = vrmMetaProp.getReferences().join(",");
        }

        if (vrmMetaProp.getThumbnailImageTexture()) {
          metaDef.texture = context.createTextureInfoDef(
            vrmMetaProp.getThumbnailImageTexture()!,
            vrmMetaProp.getThumbnailImageTextureInfo()!
          ).index;
        }

        if (vrmMetaProp.getAvatarPermission() !== undefined) {
          if (
            vrmMetaProp.getAvatarPermission() === "onlySeparatelyLicensedPerson"
          ) {
            metaDef.allowedUserName = "ExplicitlyLicensedPerson";
          } else if (vrmMetaProp.getAvatarPermission() === "onlyAuthor") {
            metaDef.allowedUserName = "OnlyAuthor";
          } else if (vrmMetaProp.getAvatarPermission() === "everyone") {
            metaDef.allowedUserName = "Everyone";
          }
        }

        if (vrmMetaProp.getAllowExcessivelyViolentUsage() !== undefined) {
          metaDef.violentUssageName =
            vrmMetaProp.getAllowExcessivelyViolentUsage() === true
              ? "Allow"
              : "Disallow";
        }

        if (vrmMetaProp.getAllowExcessivelySexualUsage() !== undefined) {
          metaDef.sexualUssageName =
            vrmMetaProp.getAllowExcessivelySexualUsage() === true
              ? "Allow"
              : "Disallow";
        }

        if (vrmMetaProp.getCommercialUsage() !== undefined) {
          metaDef.commercialUssageName =
            vrmMetaProp.getCommercialUsage() !== "personalNonProfit"
              ? "Allow"
              : "Disallow";
        }

        if (vrmMetaProp.getAllowRedistribution() !== undefined) {
          if (vrmMetaProp.getAllowRedistribution() === false) {
            metaDef.licenseName = "Redistribution_Prohibited";
          } else {
            metaDef.licenseName =
              VRM0VRM.URL_TO_LICENSE_MAP.get(vrmMetaProp.getLicenseUrl()) ||
              "Other";
          }
        }

        if (vrmMetaProp.getOtherLicenseUrl() !== undefined) {
          metaDef.otherLicenseUrl = vrmMetaProp.getOtherLicenseUrl();
        }
      }

      if (vrmProp.getHumanoid()) {
        vrmDef.humanoid = vrmProp.getHumanoid();
      }

      if (vrmProp.getFirstPerson()) {
        vrmDef.firstPerson = vrmProp.getFirstPerson();
      }

      if (vrmProp.getBlendShapeMaster()) {
        vrmDef.blendShapeMaster = vrmProp.getBlendShapeMaster();
      }

      if (vrmProp.getSecondaryAnimation()) {
        vrmDef.secondaryAnimation = vrmProp.getSecondaryAnimation();
      }

      if (vrmProp.getMaterialProperties()) {
        vrmDef.materialProperties = vrmProp.getMaterialProperties() || [];

        this.document
          .getRoot()
          .listMaterials()
          .forEach((material, materialIndex) => {
            const materialMToon =
              material.getExtension<VRM0MaterialMToonProp>(NAME);
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