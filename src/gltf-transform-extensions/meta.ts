import { ExtensibleProperty, IProperty } from "@gltf-transform/core";

interface IMeta extends IProperty {
  name: string;
  version: string;
  authors: string[];
  copyrightInformation: string;
  contactInformation: string;
  references: string[];
  thirdPartyLicenses: string;
  thumbnailImage: number;
  licenseUrl: string;
  avatarPermission: string;
  allowExcessivelyViolentUsage: boolean;
  allowExcessivelySexualUsage: boolean;
  commercialUsage: string;
  allowPoliticalOrReligiousUsage: boolean;
  allowAntisocialOrHateUsage: boolean;
  creditNotation: string;
  allowRedistribution: boolean;
  modification: string;
  otherLicenseUrl: string;
}

export class Meta extends ExtensibleProperty<IMeta> {}
