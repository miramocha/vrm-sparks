import { useContext, useEffect, useState } from "react";
import { Collapse, Select } from "antd";
import { AppContext } from "../providers/appContextProvider.tsx";
import { GLTFTransformExtensionUtils } from "../utils/GLTFTransformExtensionUtils.ts";
import * as UniVRMType from "@pixiv/types-vrm-0.0";

// import { Material as UniVRMMaterial } from "@pixiv/types-vrm-0.0";

type SelectOptions = { label?: string; value: number };

export default function UniVRMMaterialEditor() {
  const appContext = useContext(AppContext);
  const [materialProperties, setMaterialProperties] = useState<
    UniVRMType.Material[]
  >([]);
  const [materialOptions, setMaterialOptions] = useState<SelectOptions[]>([]);

  // Serialize MaterialProps List after save

  useEffect(() => {
    if (appContext.gltfDocument) {
      const updatedMaterialProperties =
        GLTFTransformExtensionUtils.getUniVRMExtension(
          appContext.gltfDocument
        )?.getMaterialProperties() || [];

      setMaterialProperties(updatedMaterialProperties);
      setMaterialOptions(
        updatedMaterialProperties.map((materialProperty, index) => ({
          label: materialProperty.name,
          value: index,
        }))
      );

      console.log(materialProperties);
    }
  }, [appContext.gltfDocument]);

  const accordionItems = [
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
      children: <code>{JSON.stringify({}, null, 2)}</code>,
    },
  ];

  return (
    <>
      UniVRM
      <Select options={materialOptions} />
      <Collapse accordion items={accordionItems} />
    </>
  );
}
