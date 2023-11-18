import {
  Extension,
  ExtensionProperty,
  IProperty,
  PropertyType,
  ReaderContext,
  WriterContext,
} from "@gltf-transform/core";
import * as VRMType from "@pixiv/types-vrm-0.0";
import { UNIVRM } from "../constants.ts";

const NAME = UNIVRM;

export default class VRM_vrm extends Extension {
  public readonly extensionName = NAME;
  public static readonly EXTENSION_NAME = NAME;

  public read(context: ReaderContext): this {
    if (context.jsonDoc.json.extensions?.Vrm) {
      const vrm = new VRM(this.document.getGraph());
      this.document.getRoot().setExtension(NAME, vrm);

      const vrmJSON = context.jsonDoc.json.extensions;

      if (vrmJSON.exporterVersion) {
        vrm.setExporterVersion(vrmJSON.exporterVersion as string);
      }
    }

    return this;
  }

  public write(context: WriterContext): this {
    if (context.jsonDoc.json.extensions?.Vrm) {
      const vrm = this.document.getRoot().getExtension<VRM>(NAME);
      const vrmJSON = context.jsonDoc.json.extensions.Vrm as VRMType.VRM;
      if (vrm) {
        if (vrm.getExporterVersion()) {
          console.log(vrmJSON);
        }
      }
    }
    return this;
  }
}

interface IVRM extends IProperty {
  exporterVersion: string;
}

class VRM extends ExtensionProperty<IVRM> {
  public static EXTENSION_NAME = UNIVRM;
  public declare extensionName: typeof UNIVRM;
  public declare propertyType: "Vrm";
  public declare parentTypes: [PropertyType.ROOT];

  protected init(): void {
    this.extensionName = UNIVRM;
    this.propertyType = "Vrm";
    this.parentTypes = [PropertyType.ROOT];
  }

  public setExporterVersion(exporterVersion: string) {
    return this.set("exporterVersion", exporterVersion);
  }

  public getExporterVersion() {
    return this.get("exporterVersion");
  }
}
