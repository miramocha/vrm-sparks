import { IProperty, Nullable, Property } from "@gltf-transform/core";
import { PropertyType as VRMPropertyType } from "../../constants.ts";
import { MeshAnnotationProp } from "./mesh-annotation-prop.ts";

export interface IFirstPersonProp extends IProperty {
  meshAnnotationProps: MeshAnnotationProp[];
}

export class FirstPersonProp extends Property<IFirstPersonProp> {
  public declare propertyType: VRMPropertyType.FIRST_PERSON_PROP;

  protected init(): void {
    this.propertyType = VRMPropertyType.FIRST_PERSON_PROP;
  }

  protected getDefaults(): Nullable<IFirstPersonProp> {
    return Object.assign(super.getDefaults() as IProperty, {
      meshAnnotationProps: [],
    });
  }

  public listMeshAnnotationProps(): MeshAnnotationProp[] {
    return this.listRefs("meshAnnotationProps");
  }
}
