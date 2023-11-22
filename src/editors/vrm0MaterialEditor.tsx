/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode, useContext, useEffect, useState } from "react";
import {
  // Avatar,
  Button,
  Select,
} from "antd";
import { AppContext } from "../providers/appContextProvider.tsx";
import { GLTFTransformExtensionUtils } from "../utils/GLTFTransformExtensionUtils.ts";
import MaterialProperties from "../gltf-transform-extensions/VRM0/materialProperties.ts";
import MaterialTextureList from "./vrm0/MaterialTextureList.tsx";

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
    setMaterialPropertiesList(
      GLTFTransformExtensionUtils.listVRM0MaterialProperties(
        appContext.gltfDocument!
      )
    );
  }, [appContext.gltfDocument]);

  useEffect(() => {
    setCurrentMaterialPropertiesIndex(null);
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
    console.log("settings current mat props");
  }, [currentMaterialPropertiesIndex, materialPropertiesList]);

  useEffect(() => {
    console.log("mat prop changed");
  }, [currentMaterialProperties]);

  return (
    <>
      <Select
        options={materialOptions}
        value={currentMaterialPropertiesIndex}
        onChange={(index) => {
          setCurrentMaterialPropertiesIndex(index);
        }}
      />
      <MaterialTextureList materialProperties={currentMaterialProperties} />
    </>
  );
}
