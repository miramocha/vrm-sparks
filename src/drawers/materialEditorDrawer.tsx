import { useContext, useEffect, useState } from "react";
import { Drawer, Flex, Collapse, Select, Empty } from "antd";
import { AppContext } from "../providers/appContextProvider.ts";
import { GLTFTransformExtensionUtils } from "../utils/GLTFTransformExtensionUtils.ts";

type SelectOptions = { label?: string; value: number };

export default function MaterialEditorDrawer({
  open = false,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<boolean> | undefined;
}) {
  const appContext = useContext(AppContext);
  const [materialOptions, setMaterialOptions] = useState<Array<SelectOptions>>(
    []
  );

  // const [gltfDocument, setGLTFDocument] = useState<GLTFDocument | null>(null);

  useEffect(() => {
    if (
      appContext.gltfDocument &&
      GLTFTransformExtensionUtils.isUniVRMDocument(appContext.gltfDocument)
    ) {
      const materialProperties =
        GLTFTransformExtensionUtils.getUniVRMExtensionProperties(
          appContext.gltfDocument
        )?.getMaterialProperties();

      if (materialProperties) {
        setMaterialOptions(
          materialProperties.map((materialProperty, index) => ({
            label: materialProperty.name,
            value: index,
          }))
        );
      }
    }
  }, [appContext.gltfDocument]);

  const handleClose = () => {
    if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <Drawer
      title="Material Editor"
      onClose={handleClose}
      closable={true}
      open={open}
      mask={false}
    >
      <Flex vertical gap="small">
        {appContext.gltfDocument ? (
          <>
            <Select
              value={0}
              options={materialOptions}
              // onSelect={(value) => {}}
            />
            <Collapse
              accordion
              items={[
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
              ]}
            />
          </>
        ) : (
          <Empty description="No VRM Loaded" />
        )}
      </Flex>
    </Drawer>
  );
}
