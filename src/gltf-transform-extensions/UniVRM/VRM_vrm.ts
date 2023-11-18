import { Extension, ReaderContext, WriterContext } from "@gltf-transform/core";
import * as VRMType from "@pixiv/types-vrm-0.0";
import VRM from "./VRM.ts";
import { UNIVRM } from "./constants.ts";

const NAME = UNIVRM;

export default class VRM_vrm extends Extension {
  public readonly extensionName = NAME;
  public static readonly EXTENSION_NAME = NAME;

  public read(context: ReaderContext): this {
    console.log("READING:", context.jsonDoc.json.extensions);
    if (
      context.jsonDoc.json.extensions &&
      context.jsonDoc.json.extensions[NAME]
    ) {
      const vrm = new VRM(this.document.getGraph());
      this.document.getRoot().setExtension(NAME, vrm);

      const vrmJSON = context.jsonDoc.json.extensions[NAME] as VRMType.VRM;

      if (vrmJSON.exporterVersion) {
        vrm.setExporterVersion(vrmJSON.exporterVersion as string);
      }

      if (vrmJSON.meta) {
        vrm.setMetaJSONString(JSON.stringify(vrmJSON.meta));
      }

      if (vrmJSON.humanoid) {
        vrm.setHumanoidJSONString(JSON.stringify(vrmJSON.humanoid));
      }

      if (vrmJSON.firstPerson) {
        vrm.setFirstPersonJSONString(JSON.stringify(vrmJSON.firstPerson));
      }

      if (vrmJSON.blendShapeMaster) {
        vrm.setBlendShapeMasterJSONString(
          JSON.stringify(vrmJSON.blendShapeMaster)
        );
      }

      if (vrmJSON.secondaryAnimation) {
        vrm.setSecondaryAnimationJSONString(
          JSON.stringify(vrmJSON.secondaryAnimation)
        );
      }

      if (vrmJSON.materialProperties) {
        vrm.setMaterialPropertiesJSONString(
          JSON.stringify(vrmJSON.materialProperties)
        );
      }
    }

    return this;
  }

  public write(context: WriterContext): this {
    if (
      context.jsonDoc.json.extensions &&
      context.jsonDoc.json.extensions[NAME]
    ) {
      const vrm = this.document.getRoot().getExtension<VRM>(NAME);
      const vrmJSON = context.jsonDoc.json.extensions[NAME] as VRMType.VRM;

      if (vrm) {
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
      }
    }
    return this;
  }
}
