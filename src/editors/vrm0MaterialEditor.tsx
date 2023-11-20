import { ReactNode, useContext, useEffect, useState } from "react";
import { Button, Collapse, Select } from "antd";
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

  useEffect(() => {
    if (appContext.gltfDocument) {
      const materialProperties =
        GLTFTransformExtensionUtils.getVRM0Extension(
          appContext.gltfDocument
        )?.getMaterialProperties() || [];

      // setMaterialProperties(updatedMaterialProperties);
      setMaterialOptions(
        materialProperties.map(
          (materialProperty: VRM0Type.Material, index: number) => ({
            label: materialProperty.name,
            value: index,
          })
        )
      );
    }

    if (setSaveButton) {
      const handleSaveButtonClick = () => {
        console.log("SAVING VRM0");
        // if (appContext.gltfDocument) {
        //   const vrmExtension = GLTFTransformExtensionUtils.getVRM0Extension(
        //     appContext.gltfDocument
        //   );

        //   if (vrmExtension) {
        //     const updatedMaterialProperties =
        //       vrmExtension.getMaterialProperties() || [];

        //     updatedMaterialProperties.forEach((materialProperty) => {
        //       materialProperty.vectorProperties =
        //         materialProperty.vectorProperties || [];
        //       materialProperty.vectorProperties._Color = [1, 0, 0, 1];
        //     });

        //     vrmExtension.setMaterialProperties(updatedMaterialProperties);
        //   }
        // }

        appContext.reloadGLTFDocument();
      };

      setSaveButton(
        <Button type="primary" onClick={handleSaveButtonClick} block>
          {/* Save VRM0 Material */}
          MAKE IT GREEN
        </Button>
      );
    }
  }, [appContext.gltfDocument, appContext, setSaveButton]);

  useEffect(() => {}, [setSaveButton]);

  // console.log("rerendering", materialProperties);

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
      VRM0
      <Select options={materialOptions} />
      <Collapse accordion items={accordionItems} />
    </>
  );
}
