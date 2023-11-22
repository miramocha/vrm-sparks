/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode, useContext, useEffect, useState } from "react";
import {
  Avatar,
  // Avatar,
  Button,
  Collapse,
  ColorPicker,
  List,
  Select,
  Space,
} from "antd";
import { AppContext } from "../providers/appContextProvider.tsx";
import { GLTFTransformExtensionUtils } from "../utils/GLTFTransformExtensionUtils.ts";
import { Color } from "antd/es/color-picker/color.js";
import MaterialProperties from "../gltf-transform-extensions/VRM0/materialProperties.ts";

type SelectOptions = { label?: string; value: number };

export default function VRM0MaterialEditor({
  setSaveButton,
}: {
  setSaveButton?: React.Dispatch<ReactNode>;
}) {
  const appContext = useContext(AppContext);

  const [materialPropertiesList, setMaterialPropertiesList] = useState<
    (MaterialProperties | null)[]
  >([]);
  const [currentMaterialProperties, setCurrentMaterialProperties] =
    useState<MaterialProperties | null>(null);
  const [currentMaterialPropertiesIndex, setCurrentMaterialPropertiesIndex] =
    useState<number | null>(null);

  const [materialOptions, setMaterialOptions] = useState<SelectOptions[]>([]);

  type TextureItem = {
    slot: string;
    name?: string;
    url?: string;
    mimeType?: string;
  };
  const [textureItems, setTextureItems] = useState<TextureItem[]>([]);

  useEffect(() => {
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
  }, [setSaveButton, appContext]);

  useEffect(() => {
    const newMaterialPropertiesList =
      GLTFTransformExtensionUtils.listVRM0MaterialProperties(
        appContext.gltfDocument!
      );
    setMaterialPropertiesList(newMaterialPropertiesList);
  }, [appContext]);

  useEffect(() => {
    // setCurrentMaterialProperties(materialPropertiesList[0!]);
    setCurrentMaterialPropertiesIndex(
      materialPropertiesList?.length > 0 ? 0 : null
    );
    setMaterialOptions(
      materialPropertiesList?.map((materialProperties, index) => ({
        value: index,
        label: materialProperties?.getName() || "(No Name)",
      })) || []
    );
  }, [materialPropertiesList]);

  useEffect(() => {
    setCurrentMaterialProperties(
      materialPropertiesList[currentMaterialPropertiesIndex!]
    );
  }, [currentMaterialPropertiesIndex, materialPropertiesList]);

  useEffect(() => {
    if (currentMaterialProperties) {
      const newTextureItems: TextureItem[] = [];

      if (currentMaterialProperties?.getMainTexture()) {
        const fileBuffer = currentMaterialProperties
          .getMainTexture()
          ?.getImage();

        newTextureItems.push({
          slot: "Main",
          name: currentMaterialProperties.getMainTexture()?.getName(),
          url: URL.createObjectURL(new Blob([fileBuffer!])),
          mimeType: currentMaterialProperties.getMainTexture()?.getMimeType(),
        });
        newTextureItems.push({
          slot: "Shade",
          name: currentMaterialProperties.getShadeTexture()?.getName(),
          url: URL.createObjectURL(new Blob([fileBuffer!])),
          mimeType: currentMaterialProperties.getShadeTexture()?.getMimeType(),
        });
      }

      setTextureItems(newTextureItems);
    }
  }, [currentMaterialProperties]);

  const accordionItems = [
    {
      key: "texture",
      label: "Textures",
      children: (
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
                description={`${textureItem.name} (${textureItem.mimeType})`}
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: "base",
      label: "Base",
      children: (
        <Space direction="vertical">
          <ColorPicker
            defaultFormat="rgb"
            showText={(color: Color) => (
              <span>Main Color {color.toRgbString()}</span>
            )}
          />
          <ColorPicker
            defaultFormat="rgb"
            showText={(color: Color) => (
              <span>Shade Color {color.toRgbString()}</span>
            )}
          />
          <ColorPicker
            defaultFormat="rgb"
            showText={(color: Color) => (
              <span>Shade Color {color.toRgbString()}</span>
            )}
          />
        </Space>
      ),
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
  ];

  return (
    <>
      {/* VRM0 - {currentMaterialProperties?.getName()} */}
      <Select
        options={materialOptions}
        value={currentMaterialPropertiesIndex}
        onChange={(index) => {
          setCurrentMaterialPropertiesIndex(index);
        }}
      />
      <Collapse
        accordion
        defaultActiveKey={"textures"}
        items={accordionItems}
      />
    </>
  );
}
