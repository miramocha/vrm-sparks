import { useContext } from "react";
import { Upload, Space, Card, Drawer } from "antd";
import * as Icon from "@ant-design/icons";
import { EditorContext } from "../providers/editorContextProvider.tsx";

export default function OpenVrmDrawer({
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

  const handleBeforeUpload = async (file: File) => {
    console.clear();
    editorContext.loadThreeVRMFromFile(file);
    editorContext.readVRMGLTFDocumentFromFile(file);

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
        <Card title="Upload VRM0/VRM">
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
