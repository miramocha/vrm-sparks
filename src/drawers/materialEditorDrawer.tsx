import { useContext } from "react";
import { Drawer, Flex, Empty } from "antd";
import { EditorContext } from "../providers/editorContextProvider.tsx";
import MaterialEditor from "../editors/MaterialEditor.tsx";

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
          <MaterialEditor />
        ) : (
          <Empty description="No VRM Loaded" />
        )}
      </Flex>
    </Drawer>
  );
}
