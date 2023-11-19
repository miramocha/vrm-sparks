import { ReactNode, useContext, useEffect, useState } from "react";
import { Button, Collapse, Select } from "antd";
import { AppContext } from "../providers/appContextProvider.tsx";
// import { GLTFTransformExtensionUtils } from "../utils/GLTFTransformExtensionUtils.ts";

// import { Material as UniVRMMaterial } from "@pixiv/types-vrm-0.0";

type SelectOptions = { label?: string; value: number };

export default function VRMMaterialEditor({
  setSaveButton,
}: {
  setSaveButton?: React.Dispatch<ReactNode>;
}) {
  const appContext = useContext(AppContext);
  const [materialOptions, setMaterialOptions] = useState<SelectOptions[]>([]);

  const handleSaveButtonClick = () => {
    console.log("SAVING VRM");
    appContext.reloadGLTFDocument();
  };

  useEffect(() => {
    if (appContext.gltfDocument) {
      const materialOptions = appContext.gltfDocument
        .getRoot()
        .listMaterials()
        .map((material, index) => ({
          label: material.getName(),
          value: index,
        }));

      setMaterialOptions(materialOptions);
    }
  }, [appContext.gltfDocument]);

  useEffect(() => {
    if (setSaveButton) {
      setSaveButton(
        <Button type="primary" onClick={handleSaveButtonClick} block>
          Save VRM Material
        </Button>
      );
    }
  }, [setSaveButton]);

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
      VRM
      <Select options={materialOptions} />
      <Collapse accordion items={accordionItems} />
    </>
  );
}
