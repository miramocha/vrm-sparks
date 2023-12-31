import { IProperty, Property, Node, Nullable } from "@gltf-transform/core";
import {
  PropertyType as VRMPropertyType,
  FirstPersonFlag,
} from "../../constants.ts";

export interface IMeshAnnotationProp extends IProperty {
  node: Node;
  type: FirstPersonFlag;
}

export class MeshAnnotationProp extends Property<IMeshAnnotationProp> {
  public declare propertyType: VRMPropertyType.FIRST_PERSON_MESH_ANNOTATION_PROP;

  protected init(): void {
    this.propertyType = VRMPropertyType.FIRST_PERSON_MESH_ANNOTATION_PROP;
  }

  protected getDefaults(): Nullable<IMeshAnnotationProp> {
    return Object.assign(super.getDefaults() as IProperty, {
      node: null,
      type: "auto" as FirstPersonFlag,
    });
  }

  public getFirstPersonFlag(): FirstPersonFlag {
    return this.get("type");
  }
  public setFirstPersonFlag(firstPersonFlag: FirstPersonFlag) {
    return this.set("type", firstPersonFlag);
  }

  public getNode(): Node | null {
    return this.getRef("node");
  }
  public setNode(node: Node | null): this {
    return this.setRef("node", node);
  }
}
