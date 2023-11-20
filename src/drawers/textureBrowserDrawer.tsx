import { useContext, useEffect, useState } from "react";
import { Drawer, Upload, UploadFile, Card, Tabs, Empty } from "antd";
import * as Icon from "@ant-design/icons";
import { Texture } from "@gltf-transform/core";
import { RcFile } from "antd/es/upload";
import { Document as GLTFDocument } from "@gltf-transform/core";
import { AppContext } from "../providers/appContextProvider.tsx";
import { GLTFTransformExtensionUtils } from "../utils/GLTFTransformExtensionUtils.ts";

export default function TextureBrowserDrawer({
  open = false,
  setOpen = () => {},
}: {
  open: boolean;
  setOpen: React.Dispatch<boolean> | undefined;
}) {
  const appContext = useContext(AppContext);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isEditingVRM0, setIsEditingVRM0] = useState<boolean>(true);

  const buildFileList = (gltfDocument: GLTFDocument) => {
    const fileList: UploadFile[] = [];
    gltfDocument
      ?.getRoot()
      .listTextures()
      .forEach((texture: Texture, index) => {
        const imageBuffer = texture.getImage();
        if (imageBuffer) {
          const uploadFile: UploadFile = {
            uid: `texture_${index}_${texture.getName()}`,
            name: `${index} ${texture.getName()}`,
            status: "done",
            url: URL.createObjectURL(new Blob([imageBuffer])),
          };

          fileList.push(uploadFile);
        }
      });
    return fileList;
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBeforeUpload = async (file: RcFile) => {
    if (appContext.gltfDocument) {
      appContext.gltfDocument
        ?.createTexture(file.name)
        .setImage(new Uint8Array(await file.arrayBuffer()))
        .setMimeType(file.type);
      ``;
      setFileList(buildFileList(appContext.gltfDocument));
    }

    return false;
  };

  useEffect(() => {
    if (appContext.gltfDocument) {
      setIsEditingVRM0(
        GLTFTransformExtensionUtils.isVRM0Document(appContext.gltfDocument)
      );
      setFileList(buildFileList(appContext.gltfDocument));
    }
  }, [appContext.gltfDocument]);

  const browseTab = appContext.gltfDocument ? (
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
      onPreview={() => {
        console.log("previewing");
      }}
    />
  ) : (
    <Empty description="No VRM Loaded" />
  );

  const upload = appContext.gltfDocument ? (
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
  ) : null;

  // const importTab = appContext.gltfDocument ? (
  //   <Space direction="vertical" size="small" style={{ display: "flex" }}>
  //     <Card title="Upload Image File">{upload}</Card>
  //     <Card title="Paste URL"></Card>
  //   </Space>
  // ) : (
  //   <Empty description="No VRM Loaded" />
  // );

  return (
    <Drawer
      title="Texture Browser"
      onClose={handleClose}
      closable={true}
      footer={upload}
      open={open}
      mask={false}
    >
      {isEditingVRM0 ? "VRM0" : "VRM"}
      <Tabs
        items={[
          { label: "Browse", key: "browse", children: browseTab },
          // { label: "Import", key: "import", children: importTab },
        ]}
      />
    </Drawer>
  );
}
