import { ReactNode, useContext, useEffect, useState } from "react";
import { Drawer, Flex, Empty } from "antd";
import { AppContext } from "../providers/appContextProvider.tsx";
import { GLTFTransformExtensionUtils } from "../utils/GLTFTransformExtensionUtils.ts";
import VRM0MaterialEditor from "../editors/vrm0MaterialEditor.tsx";
import VRMMaterialEditor from "../editors/vrmMaterialEditor.tsx";

export default function MaterialEditorDrawer({
  open = false,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<boolean> | undefined;
}) {
  const appContext = useContext(AppContext);
  const [isEditingVRM0, setIsEditingVRM0] = useState<boolean>(true);
  const [saveButton, setSaveButton] = useState<ReactNode | null>(null);

  useEffect(() => {
    if (appContext.gltfDocument) {
      const updatedIsEditingVRM0 = GLTFTransformExtensionUtils.isVRM0Document(
        appContext.gltfDocument
      );
      setIsEditingVRM0(updatedIsEditingVRM0);
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
      footer={saveButton}
    >
      <Flex vertical gap="small">
        {appContext.gltfDocument ? (
          <>
            {isEditingVRM0 ? (
              <VRM0MaterialEditor setSaveButton={setSaveButton} />
            ) : (
              <VRMMaterialEditor setSaveButton={setSaveButton} />
            )}
          </>
        ) : (
          <Empty description="No VRM Loaded" />
        )}
      </Flex>
    </Drawer>
  );
}
