import { Avatar, Empty, List } from "antd";
import { MaterialMToonProp } from "../../gltf-transform-extensions/material-mtoon-prop.ts";
import { Material } from "@gltf-transform/core";

export default function MaterialTextureList({
  materialMToon,
  material,
}: {
  materialMToon: MaterialMToonProp | null;
  material: Material | null;
}) {
  type TextureItem = {
    slot: string;
    name?: string;
    url?: string;
    mimeType?: string;
  };
  const textureItems: TextureItem[] = [];

  if (material) {
    const baseTextureFileBuffer = material.getBaseColorTexture()?.getImage();
    textureItems.push({
      slot: "Base",
      name: material.getBaseColorTexture()?.getName() || "Not set",
      url: URL.createObjectURL(new Blob([baseTextureFileBuffer!])),
      mimeType: material.getBaseColorTexture()?.getMimeType() || "Not Set",
    });

    const emissiveTextureFileBuffer = material.getEmissiveTexture()?.getImage();
    textureItems.push({
      slot: "Emissive",
      name: material.getEmissiveTexture()?.getName() || "Not set",
      url: URL.createObjectURL(new Blob([emissiveTextureFileBuffer!])),
      mimeType: material.getEmissiveTexture()?.getMimeType() || "Not Set",
    });

    const normalTextureFileBuffer = material.getNormalTexture()?.getImage();
    textureItems.push({
      slot: "Normal",
      name: material.getNormalTexture()?.getName() || "Not set",
      url: URL.createObjectURL(new Blob([normalTextureFileBuffer!])),
      mimeType: material.getNormalTexture()?.getMimeType() || "Not Set",
    });
  }

  if (materialMToon) {
    const shadeTextureFileBuffer = materialMToon
      .getShadeMultiplyTexture()
      ?.getImage();
    textureItems.push({
      slot: "Shade",
      name: materialMToon.getShadeMultiplyTexture()?.getName() || "Not set",
      url: URL.createObjectURL(new Blob([shadeTextureFileBuffer!])),
      mimeType:
        materialMToon.getShadeMultiplyTexture()?.getMimeType() || "Not Set",
    });

    const rimTextureFileBuffer = materialMToon
      .getRimMultiplyTexture()
      ?.getImage();
    textureItems.push({
      slot: "Rim",
      name: materialMToon.getRimMultiplyTexture()?.getName() || "Not set",
      url: URL.createObjectURL(new Blob([rimTextureFileBuffer!])),
      mimeType:
        materialMToon.getRimMultiplyTexture()?.getMimeType() || "Not Set",
    });

    const outlineWidthTextureFileBuffer = materialMToon
      .getOutlineWidthMultiplyTexture()
      ?.getImage();
    textureItems.push({
      slot: "Outline",
      name:
        materialMToon.getOutlineWidthMultiplyTexture()?.getName() || "Not set",
      url: URL.createObjectURL(new Blob([outlineWidthTextureFileBuffer!])),
      mimeType:
        materialMToon.getOutlineWidthMultiplyTexture()?.getMimeType() ||
        "Not Set",
    });
  }

  return (
    <>
      {materialMToon ? (
        <List
          itemLayout="vertical"
          dataSource={textureItems}
          renderItem={(textureItem) => (
            <List.Item key={textureItem.slot}>
              <List.Item.Meta
                avatar={
                  <Avatar shape="square" size="large" src={textureItem.url} />
                }
                title={<span>{textureItem.slot}</span>}
                description={`${textureItem.name} (${textureItem.mimeType})`}
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description="No Material Selected" />
      )}
    </>
  );
}
