import { Extension } from "@gltf-transform/core";
import { VRMC_VRM } from "../constants.ts";

const NAME = VRMC_VRM;

export default class VRMC_vrm extends Extension {
  public readonly extensionName = NAME;
  public static readonly EXTENSION_NAME = NAME;

  public read(): this {
    return this;
  }

  public write(): this {
    return this;
  }
}
