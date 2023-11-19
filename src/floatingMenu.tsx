import { useState } from "react";
import { FloatButton, Divider } from "antd";
import * as Icon from "@ant-design/icons";

import OpenVrmDrawer from "./drawers/openVrmDrawer.tsx";
// import ExportVrmDrawer from "./drawers/exportVrmDrawer";
import MaterialEditorDrawer from "./drawers/materialEditorDrawer.tsx";
import TextureBrowserDrawer from "./drawers/textureBrowserDrawer.tsx";
// import MetadataEditorDrawer from "./drawers/metadataEditor";
// import ExpressionPreviewDrawer from "./drawers/expressionPreviewDrawer";
// import SettingsDrawer from "./drawers/settingsDrawer";
// import AboutDrawer from "./drawers/aboutDrawer";
// import JsonEditorDrawer from "./drawers/jsonEditorDrawer";
// import LoadAnimationDrawer from "./drawers/loadAnimationDrawer";

export default function FloatingMenu() {
  const [currentOpenDrawer, setCurrentOpenDrawer] = useState<string | null>(
    "open-vrm"
  );
  const buildOpenDrawerFunction = (key: string) => (open: boolean) => {
    if (open) {
      setCurrentOpenDrawer(key);
    } else {
      setCurrentOpenDrawer(null);
    }
  };
  const toggleDrawer = (key: string) => {
    if (currentOpenDrawer === key) {
      setCurrentOpenDrawer(null);
    } else {
      setCurrentOpenDrawer(key);
    }
  };

  return (
    <>
      <OpenVrmDrawer
        open={currentOpenDrawer === "open-vrm"}
        setOpen={buildOpenDrawerFunction("open-vrm")}
      />
      <MaterialEditorDrawer
        open={currentOpenDrawer === "material-editor"}
        setOpen={buildOpenDrawerFunction("material-editor")}
      />
      <TextureBrowserDrawer
        open={currentOpenDrawer === "texture-browser"}
        setOpen={buildOpenDrawerFunction("texture-browser")}
      />

      <FloatButton.Group shape="circle" style={{ left: 24, top: 24 }}>
        <Divider children="Open/Export" orientation="left" />
        <FloatButton
          icon={<Icon.FolderOpenFilled />}
          tooltip="Open VRM"
          onClick={() => {
            toggleDrawer("open-vrm");
          }}
          type={currentOpenDrawer === "open-vrm" ? "primary" : "default"}
        />
        <FloatButton
          icon={<Icon.ExportOutlined />}
          tooltip="Export VRM"
          onClick={() => {
            toggleDrawer("export-vrm");
          }}
          type={currentOpenDrawer === "export-vrm" ? "primary" : "default"}
        />
        <Divider children="Edit" orientation="left" />
        <FloatButton
          icon={<Icon.BgColorsOutlined />}
          tooltip="Material Editor"
          onClick={() => {
            toggleDrawer("material-editor");
          }}
          type={currentOpenDrawer === "material-editor" ? "primary" : "default"}
        />
        <FloatButton
          icon={<Icon.FileImageOutlined />}
          tooltip="Texture Browser"
          onClick={() => {
            toggleDrawer("texture-browser");
          }}
          type={currentOpenDrawer === "texture-browser" ? "primary" : "default"}
        />

        <Divider children="Language" orientation="left" />
        <FloatButton description="🇺🇸 US" tooltip="English" type="primary" />
        <FloatButton description="🇯🇵 JP" tooltip="日本語" />
        <FloatButton description="🇹🇭 TH" tooltip="ภาษาไทย" />
        <Divider children="About" orientation="left" />
        <FloatButton
          icon={<Icon.InfoCircleFilled />}
          tooltip="About"
          onClick={() => {
            toggleDrawer("about");
          }}
          type={currentOpenDrawer === "about" ? "primary" : "default"}
        />
      </FloatButton.Group>
    </>
  );
}
