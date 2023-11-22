import { useContext } from "react";
import { Drawer, Button } from "antd";
import { AppContext } from "../providers/appContextProvider.tsx";
import { GLTFTransformExtensionUtils } from "../utils/GLTFTransformExtensionUtils.ts";

export default function ExportVrmDrawer({
  open = false,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<boolean> | undefined;
}) {
  const appContext = useContext(AppContext);

  const handleClose = () => {
    if (setOpen) {
      setOpen(false);
    }
  };

  const handleExportButtonClick = async () => {
    if (appContext.gltfDocument) {
      const file = await GLTFTransformExtensionUtils.writeVRMGLTFDocumentToFile(
        appContext.gltfDocument,
        `exportedVrm_${Date.now()}.vrm`
      );

      const link = document.createElement("a");
      link.style.display = "none";
      document.body.appendChild(link);
      link.href = URL.createObjectURL(file);
      link.download = file.name;
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Drawer
      title="Export VRM"
      onClose={handleClose}
      closable={true}
      open={open}
      mask={false}
      footer={
        appContext.gltfDocument ? (
          <Button type="primary" onClick={handleExportButtonClick} block>
            Export
          </Button>
        ) : null
      }
    ></Drawer>
  );
}
