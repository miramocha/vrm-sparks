import { Extension } from "@gltf-transform/core";
import { VRMC_MATERIALS_MTOON } from "./constants.ts";

const NAME = VRMC_MATERIALS_MTOON;

export default class VRMC_materials_mtoon extends Extension {
  public readonly extensionName = NAME;
  public static readonly EXTENSION_NAME = NAME;

  public read(): this {
    return this;
  }

  public write(): this {
    return this;
  }
}
