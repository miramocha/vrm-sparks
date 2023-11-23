import { useCallback, useContext, useEffect, useState } from "react";
import { Drawer, Upload, UploadFile, Card, Tabs, Empty } from "antd";
import * as Icon from "@ant-design/icons";
import { Texture } from "@gltf-transform/core";
import { RcFile } from "antd/es/upload";
import { EditorContext } from "../providers/editorContextProvider.tsx";

export default function TextureBrowserDrawer({
  open = false,
  setOpen = () => {},
}: {
  open: boolean;
  setOpen: React.Dispatch<boolean> | undefined;
}) {
  const editorContext = useContext(EditorContext);

  const buildFileList = useCallback((): UploadFile[] => {
    return (
      editorContext.gltfDocument
        ?.getRoot()
        .listTextures()
        .map((texture: Texture, index) => {
          const imageBuffer = texture.getImage();
          const uploadFile: UploadFile = {
            uid: `texture_${index}_${texture.getName()}`,
            name: `${texture.getName()}`,
            status: "done",
          };

          if (imageBuffer) {
            uploadFile.url = URL.createObjectURL(new Blob([imageBuffer]));
          }

          return uploadFile;
        }) || []
    );
  }, [editorContext.gltfDocument]);

  useEffect(() => {
    setFileList(buildFileList());
  }, [buildFileList, editorContext.gltfDocument]);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleBeforeUpload = async (file: RcFile) => {
    editorContext.gltfDocument
      ?.createTexture(file.name)
      .setImage(new Uint8Array(await file.arrayBuffer()))
      .setMimeType(file.type);
    setFileList(buildFileList());
    editorContext.rebuildVRMGLTF();

    return false;
  };

  return (
    <Drawer
      title="Texture Browser"
      onClose={handleClose}
      closable={true}
      footer={
        editorContext.gltfDocument ? (
          <Card title="Image Upload">
            <Upload.Dragger
              accept="image/png, image/jpeg"
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
        ) : null
      }
      open={open}
      mask={false}
    >
      {editorContext.gltfDocument ? (
        <Upload
          disabled
          accept="image/png, image/jpeg"
          beforeUpload={handleBeforeUpload}
          className="texture-browser"
          listType="picture"
          fileList={fileList}
          showUploadList={{
            showRemoveIcon: false,
            showDownloadIcon: true,
          }}
          onPreview={() => {}}
        />
      ) : (
        <Empty description="No VRM Loaded" />
      )}
    </Drawer>
  );
}
