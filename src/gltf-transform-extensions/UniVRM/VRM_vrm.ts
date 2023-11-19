import { Extension, ReaderContext, WriterContext } from "@gltf-transform/core";
import * as UniVRMType from "@pixiv/types-vrm-0.0";
import VRM from "./VRM.ts";
import { UNIVRM } from "./constants.ts";

const NAME = UNIVRM;

export default class VRM_vrm extends Extension {
  public readonly extensionName = NAME;
  public static readonly EXTENSION_NAME = NAME;

  public read(context: ReaderContext): this {
    if (
      context.jsonDoc.json.extensions &&
      context.jsonDoc.json.extensions[NAME]
    ) {
      const vrm = new VRM(this.document.getGraph());
      this.document.getRoot().setExtension(NAME, vrm);

      const vrmJSON = context.jsonDoc.json.extensions[NAME] as UniVRMType.VRM;

      if (vrmJSON.exporterVersion) {
        vrm.setExporterVersion(vrmJSON.exporterVersion as string);
      }

      if (vrmJSON.meta) {
        vrm.setSerializedMeta(JSON.stringify(vrmJSON.meta));
      }

      if (vrmJSON.humanoid) {
        vrm.setSerializedHumanoid(JSON.stringify(vrmJSON.humanoid));
      }

      if (vrmJSON.firstPerson) {
        vrm.setSerializedFirstPerson(JSON.stringify(vrmJSON.firstPerson));
      }

      if (vrmJSON.blendShapeMaster) {
        vrm.setSerializedBlendShapeMaster(
          JSON.stringify(vrmJSON.blendShapeMaster)
        );
      }

      if (vrmJSON.secondaryAnimation) {
        vrm.setSerializedSecondaryAnimation(
          JSON.stringify(vrmJSON.secondaryAnimation)
        );
      }

      if (vrmJSON.materialProperties) {
        vrm.setSerializedMaterialProperties(
          JSON.stringify(vrmJSON.materialProperties)
        );
      }
    }

    return this;
  }

  public write(context: WriterContext): this {
    const jsonDoc = context.jsonDoc;
    const vrm = this.document.getRoot().getExtension<VRM>(NAME);

    if (vrm) {
      const vrmJSON = {} as UniVRMType.VRM;
      const rootDef = jsonDoc.json;
      rootDef.extensions = rootDef.extensions || {};
      // const materialDef = jsonDoc.json.materials![materialIndex];
      // materialDef.extensions = materialDef.extensions || {};

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
    }

    console.log("SAVING UNIVRM", jsonDoc.json);

    return this;
  }
}
