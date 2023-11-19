import { useContext, useEffect, useState } from "react";
import { Drawer, Flex, Empty } from "antd";
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
    >
      <Flex vertical gap="small">
        {appContext.gltfDocument ? (
          <>
            {isEditingUniVRM ? <UniVRMMaterialEditor /> : <VRMMaterialEditor />}
          </>
        ) : (
          <Empty description="No VRM Loaded" />
        )}
      </Flex>
    </Drawer>
  );
}
