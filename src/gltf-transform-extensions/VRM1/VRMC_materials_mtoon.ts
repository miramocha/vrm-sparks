import { Extension, ReaderContext, WriterContext } from "@gltf-transform/core";
import { VRMC_MATERIALS_MTOON } from "./constants.ts";
import VRMCMaterialMToon from "./vrmcMaterialMtoon.ts";

const NAME = VRMC_MATERIALS_MTOON;

export default class VRMC_materials_mtoon extends Extension {
  public readonly extensionName = NAME;
  public static readonly EXTENSION_NAME = NAME;

  public createMaterialsMToon(): VRMCMaterialMToon {
    return new VRMCMaterialMToon(this.document.getGraph());
  }

  public read(context: ReaderContext): this {
    const materialDefs = context.jsonDoc.json.materials || [];
    materialDefs.forEach((materialDef, materialIndex) => {
      if (materialDef.extensions && materialDef.extensions[NAME]) {
        context.materials[materialIndex].setExtension(
          NAME,
          this.createMaterialsMToon()
        );
      }
    });

    return this;
  }

  public write(context: WriterContext): this {
    const jsonDoc = context.jsonDoc;

    this.document
      .getRoot()
      .listMaterials()
      .forEach((material) => {
        const materialMToonExtension =
          material.getExtension<VRMCMaterialMToon>(NAME);

        if (materialMToonExtension) {
          const materialIndex = context.materialIndexMap.get(material)!;
          const materialDef = jsonDoc.json.materials![materialIndex];
          materialDef.extensions = materialDef.extensions || {};
          // materialDef.extensions[NAME] =
          //   materialMToonExtension.getVRMCMaterialsMToon();
        }
      });

    return this;
  }
}
