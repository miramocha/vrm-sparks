import { ReactNode, useContext, useEffect, useState } from "react";
import { Avatar, Button, Collapse, List, Select } from "antd";
import { AppContext } from "../providers/appContextProvider.tsx";
import { GLTFTransformExtensionUtils } from "../utils/GLTFTransformExtensionUtils.ts";
import * as VRM0Type from "@pixiv/types-vrm-0.0";

// import * as VRM0Type from "@pixiv/types-vrm-0.0";

// import { Material as VRM0Material } from "@pixiv/types-vrm-0.0";

type SelectOptions = { label?: string; value: number };

export default function VRM0MaterialEditor({
  setSaveButton,
}: {
  setSaveButton?: React.Dispatch<ReactNode>;
}) {
  const appContext = useContext(AppContext);
  // const [materialProperties, setMaterialProperties] = useState<
  //   VRM0Type.Material[]
  // >([]);
  const [materialOptions, setMaterialOptions] = useState<SelectOptions[]>([]);
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState<
    number | null
  >(null);
  const [materialProperty, setMaterialProperty] =
    useState<VRM0Type.Material | null>(null);
  const [textureList, setTextureList] = useState<ReactNode | null>(null);

  useEffect(() => {
    if (appContext.gltfDocument) {
      const materialProperties =
        GLTFTransformExtensionUtils.getVRM0Extension(
          appContext.gltfDocument
        )?.getMaterialProperties() || [];

      setMaterialOptions(
        materialProperties.map(
          (materialProperty: VRM0Type.Material, index: number) => ({
            label: materialProperty.name,
            value: index,
          })
        )
      );

      setCurrentMaterialIndex(materialProperties?.length > 1 ? 0 : null);
    }

    if (setSaveButton) {
      const handleSaveButtonClick = () => {
        appContext.reloadGLTFDocument();
      };

      setSaveButton(
        <Button type="primary" onClick={handleSaveButtonClick} block>
          Save VRM0 Material
        </Button>
      );
    }
  }, [appContext.gltfDocument, appContext, setSaveButton]);

  useEffect(() => {
    const gltfDocument = appContext.gltfDocument;
    if (gltfDocument && currentMaterialIndex !== null) {
      const materialProperties =
        GLTFTransformExtensionUtils.getVRM0Extension(
          gltfDocument
        )?.getMaterialProperties() || [];

      const currentMaterialProperty =
        materialProperties[currentMaterialIndex] || null;
      setMaterialProperty(currentMaterialProperty);

      const textureItems: Array<{
        slot: string;
        name: string;
        url: string | null;
        textureIndex: number;
      }> = [];

      let textureList = null;
      if (currentMaterialProperty) {
        Object.keys(currentMaterialProperty.textureProperties || {}).forEach(
          (key) => {
            if (
              currentMaterialProperty?.textureProperties &&
              currentMaterialProperty.textureProperties[key] &&
              gltfDocument.getRoot().listTextures()
            ) {
              const textureIndex =
                currentMaterialProperty.textureProperties[key];

              const texture = gltfDocument.getRoot().listTextures()[
                textureIndex
              ];

              const imageBuffer = texture.getImage();
              let url = null;

              if (imageBuffer) {
                url = URL.createObjectURL(new Blob([imageBuffer]));
              }

              textureItems.push({
                slot: key,
                name: texture.getName(),
                url,
                textureIndex,
              });
            }
          }
        );

        textureList = (
          <List
            itemLayout="horizontal"
            dataSource={textureItems}
            renderItem={(textureItem) => (
              <List.Item key={textureItem.slot}>
                <List.Item.Meta
                  avatar={
                    <Avatar shape="square" size="large" src={textureItem.url} />
                  }
                  title={<span>{textureItem.slot}</span>}
                  description={`${textureItem.textureIndex} ${textureItem.name}`}
                />
              </List.Item>
            )}
          />
        );
      }
      setTextureList(textureList);
    }
  }, [appContext.gltfDocument, currentMaterialIndex]);

  const accordionItems = [
    {
      key: "texture",
      label: "Textures",
      children: textureList,
    },
    {
      key: "base",
      label: "Base",
      children: <div>TBD</div>,
    },
    {
      key: "shade",
      label: "Shade",
      children: <div>TBD</div>,
    },
    {
      key: "emission",
      label: "Emission",
      children: <div>TBD</div>,
    },
    {
      key: "rim-light",
      label: "Rim Light",
      children: <div>TBD</div>,
    },
    {
      key: "animation",
      label: "Animation",
      children: <div>TBD</div>,
    },
    {
      key: "json",
      label: "JSON",
      children: <code>{JSON.stringify(materialProperty, null, 2)}</code>,
    },
  ];

  return (
    <>
      VRM0
      <Select
        options={materialOptions}
        value={currentMaterialIndex}
        onChange={(value) => {
          setCurrentMaterialIndex(value);
        }}
      />
      <Collapse
        accordion
        defaultActiveKey={["textures"]}
        items={accordionItems}
      />
    </>
  );
}
