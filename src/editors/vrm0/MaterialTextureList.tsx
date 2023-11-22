import { Avatar, List } from "antd";

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
      name: materialProperties.getMainTexture()?.getName(),
      url: URL.createObjectURL(new Blob([mainTextureFileBuffer!])),
      mimeType: materialProperties.getMainTexture()?.getMimeType(),
    });

    const shadeTextureFileBuffer = materialProperties
      .getShadeTexture()
      ?.getImage();
    textureItems.push({
      slot: "Shade",
      name: materialProperties.getShadeTexture()?.getName(),
      url: URL.createObjectURL(new Blob([shadeTextureFileBuffer!])),
      mimeType: materialProperties.getShadeTexture()?.getMimeType(),
    });

    const normalTextureFileBuffer = materialProperties
      .getBumpMapTexture()
      ?.getImage();
    textureItems.push({
      slot: "Normal",
      name: materialProperties.getBumpMapTexture()?.getName(),
      url: URL.createObjectURL(new Blob([normalTextureFileBuffer!])),
      mimeType: materialProperties.getBumpMapTexture()?.getMimeType(),
    });

    const emissionTextureFileBuffer = materialProperties
      .getEmissionMapTexture()
      ?.getImage();
    textureItems.push({
      slot: "Emission",
      name: materialProperties.getEmissionMapTexture()?.getName(),
      url: URL.createObjectURL(new Blob([emissionTextureFileBuffer!])),
      mimeType: materialProperties.getEmissionMapTexture()?.getMimeType(),
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
        <div>MATS</div>
      )}
    </>
  );
}
