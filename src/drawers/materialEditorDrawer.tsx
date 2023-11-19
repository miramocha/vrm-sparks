import { ReactNode, useContext, useEffect, useState } from "react";
import { Drawer, Flex, Empty, Button } from "antd";
import { AppContext } from "../providers/appContextProvider.tsx";
import { GLTFTransformExtensionUtils } from "../utils/GLTFTransformExtensionUtils.ts";
import UniVRMMaterialEditor from "../editors/uniVRMMaterialEditor.tsx";
import VRMMaterialEditor from "../editors/vrmMaterialEditor.tsx";

export default function MaterialEditorDrawer({
  open = false,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<boolean> | undefined;
}) {
  const appContext = useContext(AppContext);
  const [isEditingUniVRM, setIsEditingUniVRM] = useState<boolean>(true);
  const [saveButton, setSaveButton] = useState<ReactNode>(
    <Button type="primary" disabled block>
      Save
    </Button>
  );

  useEffect(() => {
    if (appContext.gltfDocument) {
      const updatedIsEditingUniVRM =
        GLTFTransformExtensionUtils.isUniVRMDocument(appContext.gltfDocument);
      setIsEditingUniVRM(updatedIsEditingUniVRM);
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
            {isEditingUniVRM ? (
              <UniVRMMaterialEditor setSaveButton={setSaveButton} />
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
