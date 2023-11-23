import { useCallback, useContext, useEffect, useState } from "react";
import { Drawer, Upload, UploadFile, Card, Empty, List, Avatar } from "antd";
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

  type TextureItem = {
    slot: number;
    name?: string;
    url?: string;
    mimeType?: string;
  };
  const buildTextureItems = useCallback((): TextureItem[] => {
    return (
      editorContext.gltfDocument
        ?.getRoot()
        .listTextures()
        .map((texture: Texture, index) => {
          const textureFileBuffer = texture?.getImage();
          return {
            slot: index,
            name: texture?.getName() || "Not set",
            url: URL.createObjectURL(new Blob([textureFileBuffer!])),
            mimeType: texture?.getMimeType() || "Not Set",
          };
        }) || []
    );
  }, [editorContext.gltfDocument]);

  useEffect(() => {
    setTextureItems(buildTextureItems());
  }, [buildTextureItems, editorContext.gltfDocument]);

  const [textureItems, setTextureItems] = useState<TextureItem[]>([]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleBeforeUpload = async (file: RcFile) => {
    editorContext.gltfDocument
      ?.createTexture(file.name)
      .setImage(new Uint8Array(await file.arrayBuffer()))
      .setMimeType(file.type);
    setTextureItems(buildTextureItems());
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
        <List
          itemLayout="vertical"
          dataSource={textureItems}
          renderItem={(textureItem) => (
            <List.Item key={textureItem.slot}>
              <List.Item.Meta
                avatar={
                  <Avatar shape="square" size="large" src={textureItem.url} />
                }
                title={<span>{textureItem.name}</span>}
                description={textureItem.mimeType}
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description="No VRM Loaded" />
      )}
    </Drawer>
  );
}
