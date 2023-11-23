import { useContext } from "react";
import { Drawer, Flex, Empty } from "antd";
import VRM0MaterialEditor from "../editors/vrm0MaterialEditor.tsx";
import VRMMaterialEditor from "../editors/vrmMaterialEditor.tsx";
import { EditorContext } from "../providers/editorContextProvider.tsx";
import { GLTFTransformExtensionUtils } from "../utils/GLTFTransformExtensionUtils.ts";

export default function MaterialEditorDrawer({
  open = false,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<boolean> | undefined;
}) {
  const editorContext = useContext(EditorContext);

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
        {editorContext.gltfDocument ? (
          <>
            {GLTFTransformExtensionUtils.isVRM0Document(
              editorContext.gltfDocument
            ) ? (
              <VRM0MaterialEditor />
            ) : (
              <VRMMaterialEditor />
            )}
          </>
        ) : (
          <Empty description="No VRM Loaded" />
        )}
      </Flex>
    </Drawer>
  );
}
