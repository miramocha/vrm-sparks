import {
  Extension,
  ReaderContext,
  TextureInfo,
  WriterContext,
} from "@gltf-transform/core";
import * as VRM0Type from "@pixiv/types-vrm-0.0";
import * as VRM1Type from "@pixiv/types-vrmc-vrm-1.0";
import VRM0Prop from "./properties/vrm0-vrm-prop.ts";
import { VRM0 as NAME } from "./constants.ts";
import * as VRMConstants from "../constants.ts";
import VRM0MaterialMToonProp from "./properties/vrm0-material-mtoon-prop.ts";
import { FirstPersonProp } from "../properties/first-person/first-person-prop.ts";
import { HumanoidProp } from "../properties/humanoid/humanoid-prop.ts";
import { MetaProp } from "../properties/meta-prop.ts";
import { HumanBoneProp } from "../properties/humanoid/human-bone-prop.ts";
import { MeshAnnotationProp } from "../properties/first-person/mesh-annotation-prop.ts";
import { LookAtProp } from "../properties/look-at/look-at-prop.ts";

export default class VRM0VRM extends Extension {
  public readonly extensionName = NAME;
  public static readonly EXTENSION_NAME = NAME;

  public read(context: ReaderContext): this {
    const jsonDoc = context.jsonDoc;

    if (jsonDoc.json.extensions && jsonDoc.json.extensions[NAME]) {
      const vrmDef = jsonDoc.json.extensions[NAME] as VRM0Type.VRM;
      const textureDefs = jsonDoc.json.textures || [];

      const vrmProp = new VRM0Prop(this.document.getGraph());
      this.document.getRoot().setExtension(NAME, vrmProp);

      if (vrmDef.exporterVersion) {
        vrmProp.setExporterVersion(vrmDef.exporterVersion as string);
      }

      if (vrmDef.meta) {
        const vrmMetaProp = new MetaProp(this.document.getGraph());
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
            VRMConstants.LICENSE_TO_URL_MAP.get(metaDef.licenseName)!
          );
        }
        if (metaDef.otherLicenseUrl !== undefined) {
          vrmMetaProp.setOtherLicenseUrl(metaDef.otherLicenseUrl);
        }
      }

      if (vrmDef.humanoid) {
        const vrmHumanoidProp = new HumanoidProp(this.document.getGraph());
        vrmProp.setHumanoidProp(vrmHumanoidProp);

        vrmDef.humanoid.humanBones?.forEach((humanbone) => {
          const humanBoneProp = new HumanBoneProp(this.document.getGraph());
          const node = context.nodes[humanbone.node!];
          humanBoneProp.setNode(node!);

          const normalizedBoneName = VRMConstants.VRM0_BONE_TO_VRM1_BONE.get(
            humanbone.bone!
          );

          if (normalizedBoneName) {
            vrmHumanoidProp.setHumanBoneProp(normalizedBoneName, humanBoneProp);
          }
        });
      }

      // LookAt & First Person
      if (vrmDef.firstPerson) {
        const firstPersonDef = vrmDef.firstPerson;

        // Setting up VRMC First Person
        const vrmFirstPersonProp = new FirstPersonProp(
          this.document.getGraph()
        );
        vrmProp.setFirstPersonProp(vrmFirstPersonProp);
        firstPersonDef.meshAnnotations?.forEach((meshAnnotationDef) => {
          const node = context.nodes[meshAnnotationDef.mesh!];
          const meshAnnotationProp = new MeshAnnotationProp(
            this.document.getGraph()
          );
          meshAnnotationProp.setFirstPersonFlag(
            meshAnnotationDef.firstPersonFlag as VRMConstants.FirstPersonFlag
          );
          meshAnnotationProp.setNode(node);
          vrmFirstPersonProp.listMeshAnnotationProps().push(meshAnnotationProp);
        });

        // Setting up VRMC LookAt
        const lookAtProp = new LookAtProp(this.document.getGraph());
        vrmProp.setLookAtProp(lookAtProp);
        vrmProp.setFirstPersonBoneNode(
          context.nodes[firstPersonDef.firstPersonBone!]
        ); // Just in case when converting back to VRM0

        if (firstPersonDef.lookAtTypeName === "Bone") {
          lookAtProp.setType("bone");
        } else if (firstPersonDef.lookAtTypeName === "BlendShape") {
          lookAtProp.setType("expression");
        }

        if (firstPersonDef.lookAtHorizontalInner?.curve) {
          vrmProp.setLookAtHorizontalInnerCurve(
            firstPersonDef.lookAtHorizontalInner.curve
          );
        }
        if (firstPersonDef.lookAtHorizontalOuter?.curve) {
          vrmProp.setLookAtHorizontalOuterCurve(
            firstPersonDef.lookAtHorizontalOuter.curve
          );
        }
        if (firstPersonDef.lookAtVerticalDown?.curve) {
          vrmProp.setLookAtVerticalDownCurve(
            firstPersonDef.lookAtVerticalDown.curve
          );
        }
        if (firstPersonDef.lookAtVerticalUp?.curve) {
          vrmProp.setLookAtVerticalUpCurve(
            firstPersonDef.lookAtVerticalUp.curve
          );
        }

        lookAtProp.setRangeMapHorizontalInner({
          inputMaxValue:
            firstPersonDef.lookAtHorizontalInner?.xRange ||
            lookAtProp.getRangeMapHorizontalInner().inputMaxValue,
          outputScale:
            firstPersonDef.lookAtHorizontalInner?.yRange ||
            lookAtProp.getRangeMapHorizontalInner().outputScale,
        });
        lookAtProp.setRangeMapHorizontalOuter({
          inputMaxValue:
            firstPersonDef.lookAtHorizontalOuter?.xRange ||
            lookAtProp.getRangeMapHorizontalOuter().inputMaxValue,
          outputScale:
            firstPersonDef.lookAtHorizontalOuter?.yRange ||
            lookAtProp.getRangeMapHorizontalOuter().outputScale,
        });
        lookAtProp.setRangeMapVerticalDown({
          inputMaxValue:
            firstPersonDef.lookAtVerticalDown?.xRange ||
            lookAtProp.getRangeMapVerticalDown().inputMaxValue,
          outputScale:
            firstPersonDef.lookAtVerticalDown?.yRange ||
            lookAtProp.getRangeMapVerticalDown().outputScale,
        });
        lookAtProp.setRangeMapVerticalUp({
          inputMaxValue:
            firstPersonDef.lookAtVerticalUp?.xRange ||
            lookAtProp.getRangeMapVerticalUp().inputMaxValue,
          outputScale:
            firstPersonDef.lookAtVerticalUp?.yRange ||
            lookAtProp.getRangeMapVerticalUp().outputScale,
        });

        if (firstPersonDef.firstPersonBoneOffset) {
          const offsetFromHeadBone = lookAtProp.getOffsetFromHeadBone();
          offsetFromHeadBone[0] =
            firstPersonDef.firstPersonBoneOffset.x || offsetFromHeadBone[0];
          offsetFromHeadBone[1] =
            firstPersonDef.firstPersonBoneOffset.y || offsetFromHeadBone[1];
          offsetFromHeadBone[2] =
            firstPersonDef.firstPersonBoneOffset.z || offsetFromHeadBone[2];
        }
      }

      // Expressions
      if (vrmDef.blendShapeMaster) {
        vrmProp.setBlendShapeMaster(vrmDef.blendShapeMaster);
      }

      // Spring bones
      if (vrmDef.secondaryAnimation) {
        vrmProp.setSecondaryAnimation(vrmDef.secondaryAnimation);
      }

      if (vrmDef.materialProperties) {
        vrmProp.setMaterialProperties(vrmDef.materialProperties);

        vrmDef.materialProperties.forEach(
          (
            materialPropertiesDef: VRM0Type.Material,
            materialPropertiesDefIndex: number
          ) => {
            const materialMToon = new VRM0MaterialMToonProp(
              this.document.getGraph()
            );
            const material = context.materials[materialPropertiesDefIndex];
            material.setExtension(NAME, materialMToon);

            const texturePropertiesDef =
              materialPropertiesDef.textureProperties || {};

            // PBR Sync - set emissive/base/normal color and texture on PBR using VRM as source of truth
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
      const vrmDef = {} as VRM0Type.VRM;
      const rootDef = jsonDoc.json;
      rootDef.extensions = rootDef.extensions || {};

      vrmDef.specVersion = "0.0";

      if (vrmProp.getExporterVersion()) {
        vrmDef.exporterVersion = "GLTF Transformer";
      }

      const vrmMetaProp = vrmProp.getMetaProp();
      vrmDef.meta = vrmDef.meta || {};

      if (vrmMetaProp) {
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
              VRMConstants.URL_TO_LICENSE_MAP.get(
                vrmMetaProp.getLicenseUrl()
              ) || "Other";
          }
        }

        if (vrmMetaProp.getOtherLicenseUrl() !== undefined) {
          metaDef.otherLicenseUrl = vrmMetaProp.getOtherLicenseUrl();
        }
      }

      const vrmHumanoidProp = vrmProp.getHumanoidProp();
      vrmDef.humanoid = vrmDef.humanoid || {};

      if (vrmHumanoidProp) {
        const humanoidDef = vrmDef.humanoid;

        // WARNING - potential data loss when converted from VRM1
        console.warn(
          "POTENTIAL DATA LOSS MIGHT OCCUR WHEN CONVERTED FROM VRM1"
        );
        const humanBonesDef = [] as VRM0Type.HumanoidBone[];
        VRMConstants.VRM1_BONE_ORDER.forEach(
          (vrm1Bone: VRM1Type.HumanoidHumanBoneName) => {
            const humanoidBoneProp = vrmHumanoidProp.getHumanBoneProp(vrm1Bone);
            const vrm0Bone = VRMConstants.VRM1_BONE_TO_VRM0_BONE.get(vrm1Bone);
            const node = humanoidBoneProp?.getNode();
            if (node) {
              const nodeIndex = context.nodeIndexMap.get(node);
              humanBonesDef.push({
                bone: vrm0Bone,
                node: nodeIndex,
                useDefaultValues: true,
              });
            }
          }
        );
        humanoidDef.humanBones = humanBonesDef;
      }

      const firstPersonProp = vrmProp.getFirstPersonProp();
      vrmDef.firstPerson = vrmDef.firstPerson || {};
      if (firstPersonProp) {
        const firstPersonDef = vrmDef.firstPerson;

        const node = vrmProp.getFirstPersonBoneNode();
        if (node) {
          firstPersonDef.firstPersonBone = context.nodeIndexMap.get(node);
        }

        firstPersonDef.meshAnnotations = firstPersonProp
          .listMeshAnnotationProps()
          .map((meshAnnotationProp) => {
            const meshNode = meshAnnotationProp.getNode();
            return {
              mesh: context.nodeIndexMap.get(meshNode!),
              firstPersonFlag: meshAnnotationProp.getFirstPersonFlag(),
            };
          });
      }

      const lookAtProp = vrmProp.getLookAtProp();
      if (lookAtProp) {
        const firstPersonDef = vrmDef.firstPerson;
        if (lookAtProp.getType() === "bone") {
          firstPersonDef.lookAtTypeName = "Bone";
        } else if (lookAtProp.getType() === "expression") {
          firstPersonDef.lookAtTypeName = "BlendShape";
        }

        firstPersonDef.lookAtHorizontalInner =
          firstPersonDef.lookAtHorizontalInner || {};
        if (lookAtProp.getRangeMapHorizontalInner()) {
          firstPersonDef.lookAtHorizontalInner.xRange =
            lookAtProp.getRangeMapHorizontalInner().inputMaxValue;
          firstPersonDef.lookAtHorizontalInner.yRange =
            lookAtProp.getRangeMapHorizontalInner().outputScale;
          firstPersonDef.lookAtHorizontalInner.curve =
            vrmProp.getLookAtHorizontalInnerCurve();
        }

        firstPersonDef.lookAtHorizontalOuter =
          firstPersonDef.lookAtHorizontalOuter || {};
        if (lookAtProp.getRangeMapHorizontalOuter()) {
          firstPersonDef.lookAtHorizontalOuter.xRange =
            lookAtProp.getRangeMapHorizontalOuter().inputMaxValue;
          firstPersonDef.lookAtHorizontalOuter.yRange =
            lookAtProp.getRangeMapHorizontalOuter().outputScale;
          firstPersonDef.lookAtHorizontalOuter.curve =
            vrmProp.getLookAtHorizontalOuterCurve();
        }

        firstPersonDef.lookAtVerticalDown =
          firstPersonDef.lookAtVerticalDown || {};
        if (lookAtProp.getRangeMapVerticalDown()) {
          firstPersonDef.lookAtVerticalDown.xRange =
            lookAtProp.getRangeMapVerticalDown().inputMaxValue;
          firstPersonDef.lookAtVerticalDown.yRange =
            lookAtProp.getRangeMapVerticalDown().outputScale;
          firstPersonDef.lookAtVerticalDown.curve =
            vrmProp.getLookAtVerticalDownCurve();
        }

        firstPersonDef.lookAtVerticalUp = firstPersonDef.lookAtVerticalUp || {};
        if (lookAtProp.getRangeMapVerticalUp()) {
          firstPersonDef.lookAtVerticalUp.xRange =
            lookAtProp.getRangeMapVerticalUp().inputMaxValue;
          firstPersonDef.lookAtVerticalUp.yRange =
            lookAtProp.getRangeMapVerticalUp().outputScale;
          firstPersonDef.lookAtVerticalUp.curve =
            vrmProp.getLookAtVerticalUpCurve();
        }
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
                materialPropertiesDef.vectorProperties._EmissionColor = [
                  ...material.getEmissiveFactor(),
                  1,
                ];
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

      console.log("WRITE NODE", rootDef.nodes);

      rootDef.extensions[NAME] = vrmDef;
      console.log("setting VRMDEF", rootDef.extensions);

      const nodesDef = rootDef.nodes;
      if (nodesDef) {
        context.nodeIndexMap.forEach((index, node) => {
          const nodeDef = rootDef.nodes?.at(index);

          if (nodeDef) {
            nodeDef.translation = node.getTranslation();
            nodeDef.rotation = node.getRotation();
            nodeDef.scale = node.getScale();
          }
        });
      }
    }

    return this;
  }
}
