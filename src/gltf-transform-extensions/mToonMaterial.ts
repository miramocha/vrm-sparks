import { vec2, vec4, Texture, TextureInfo } from "@gltf-transform/core";
// const { R, G, B, A } = TextureChannel;

export interface IMToonMaterial {
  litColorFactor: vec4; // base color
  //   alphaTest: THREE.IUniform<number>;

  map: Texture;
  mapTextureInfo: TextureInfo;
  //   mapUvTransform: THREE.IUniform<THREE.Matrix3>;

  normalMap: Texture;
  normalMapTextureInfo: TextureInfo;
  //   normalMapUvTransform: THREE.IUniform<THREE.Matrix3>;
  normalScale: vec2;

  emissive: vec4; // emissive color
  emissiveIntensity: number;
  emissiveMap: Texture;
  emissiveMapTextureInfo: TextureInfo;
  //   emissiveMapUvTransform: THREE.IUniform<THREE.Matrix3>;

  shadeColorFactor: vec4;
  shadeMultiplyTexture: Texture;
  shadeMultiplyTextureInfo: TextureInfo;

  //   shadeMultiplyTextureUvTransform: THREE.IUniform<THREE.Matrix3>;
  shadingShiftFactor: number;
  shadingShiftTexture: Texture;
  shadingShiftTextureInfo: TextureInfo;
  //   shadingShiftTextureUvTransform: THREE.IUniform<THREE.Matrix3>;
  shadingShiftTextureScale: number;
  shadingToonyFactor: number;
  giEqualizationFactor: number;

  matcapFactor: vec4;
  matcapTexture: Texture;
  matcapTextureInfo: TextureInfo;
  //   matcapTextureUvTransform: THREE.IUniform<THREE.Matrix3>;

  parametricRimColorFactor: vec4;
  rimMultiplyTexture: Texture;
  rimMultiplyTextureInfo: TextureInfo;
  //   rimMultiplyTextureUvTransform: THREE.IUniform<THREE.Matrix3>;
  rimLightingMixFactor: number;
  parametricRimLiftFactor: number;

  outlineWidthMultiplyTexture: Texture;
  outlineWidthTextureInfo: TextureInfo;
  //   outlineWidthMultiplyTextureUvTransform: THREE.IUniform<THREE.Matrix3>;
  outlineWidthFactor: number;
  outlineColorFactor: vec4;
  outlineLightingMixFactor: number;

  uvAnimationMaskTexture: Texture;
  uvAnimationMaskTextureInfo: TextureInfo;
  //   uvAnimationMaskTextureUvTransform: THREE.IUniform<THREE.Matrix3>;
  uvAnimationScrollXOffset: number;
  uvAnimationScrollYOffset: number;
  uvAnimationRotationPhase: number;
}
