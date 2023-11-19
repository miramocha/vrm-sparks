import { useContext } from "react";
import { Upload, Space, Card, Drawer } from "antd";
import * as Icon from "@ant-design/icons";
import { AppContext } from "../providers/appContextProvider.tsx";
import { loadThreeVRM, readVRMGLTFDocument } from "../utils/LoaderUtils.ts";

export default function OpenVrmDrawer({
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

  const handleBeforeUpload = async (file: File) => {
    const newVrmGLTF = await loadThreeVRM(file);
    appContext.vrmGLTF = newVrmGLTF;

    const document = await readVRMGLTFDocument(file);
    appContext.gltfDocument = document;

    return false;
  };

  return (
    <Drawer
      title="Open VRM"
      onClose={handleClose}
      closable={true}
      open={open}
      mask={false}
    >
      <Space direction="vertical" size="small" style={{ display: "flex" }}>
        <Card title="Upload VRM">
          <Upload.Dragger
            accept=".vrm"
            maxCount={1}
            beforeUpload={handleBeforeUpload}
          >
            <p className="ant-upload-drag-icon">
              <Icon.UploadOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Upload.Dragger>
        </Card>
        <Card title="VROID Hub">TBD</Card>
      </Space>
    </Drawer>
  );
}
