import { Avatar, Empty, List } from "antd";

import MaterialProperties from "../../gltf-transform-extensions/VRM0/materialProperties.ts";

export default function MaterialTextureList({
  materialProperties,
}: {
  materialProperties: MaterialProperties | null;
}) {
  type TextureItem = {
    slot: string;
    name?: string;
    url?: string;
    mimeType?: string;
  };
  const textureItems: TextureItem[] = [];

  if (materialProperties?.getMainTexture()) {
    const mainTextureFileBuffer = materialProperties
      .getMainTexture()
      ?.getImage();
    textureItems.push({
      slot: "Main",
      name: materialProperties.getMainTexture()?.getName() || "Not set",
      url: URL.createObjectURL(new Blob([mainTextureFileBuffer!])),
      mimeType: materialProperties.getMainTexture()?.getMimeType() || "Not Set",
    });

    const shadeTextureFileBuffer = materialProperties
      .getShadeTexture()
      ?.getImage();
    textureItems.push({
      slot: "Shade",
      name: materialProperties.getShadeTexture()?.getName() || "Not set",
      url: URL.createObjectURL(new Blob([shadeTextureFileBuffer!])),
      mimeType:
        materialProperties.getShadeTexture()?.getMimeType() || "Not Set",
    });

    const normalTextureFileBuffer = materialProperties
      .getBumpMapTexture()
      ?.getImage();
    textureItems.push({
      slot: "Normal",
      name: materialProperties.getBumpMapTexture()?.getName() || "Not set",
      url: URL.createObjectURL(new Blob([normalTextureFileBuffer!])),
      mimeType:
        materialProperties.getBumpMapTexture()?.getMimeType() || "Not Set",
    });

    const emissionTextureFileBuffer = materialProperties
      .getEmissionMapTexture()
      ?.getImage();
    textureItems.push({
      slot: "Emission",
      name: materialProperties.getEmissionMapTexture()?.getName() || "Not set",
      url: URL.createObjectURL(new Blob([emissionTextureFileBuffer!])),
      mimeType:
        materialProperties.getEmissionMapTexture()?.getMimeType() || "Not Set",
    });

    const rimTextureFileBuffer = materialProperties.getRimTexture()?.getImage();
    textureItems.push({
      slot: "Rim",
      name: materialProperties.getRimTexture()?.getName() || "Not set",
      url: URL.createObjectURL(new Blob([rimTextureFileBuffer!])),
      mimeType: materialProperties.getRimTexture()?.getMimeType() || "Not Set",
    });

    const outlineWidthTextureFileBuffer = materialProperties
      .getOutlineWidthTexture()
      ?.getImage();
    textureItems.push({
      slot: "Outline",
      name: materialProperties.getOutlineWidthTexture()?.getName() || "Not set",
      url: URL.createObjectURL(new Blob([outlineWidthTextureFileBuffer!])),
      mimeType:
        materialProperties.getOutlineWidthTexture()?.getMimeType() || "Not Set",
    });
  }

  return (
    <>
      {materialProperties ? (
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
