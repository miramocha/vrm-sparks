import { useContext } from "react";
import { RGBA } from "@ctrl/tinycolor";
import MaterialProperties from "../../gltf-transform-extensions/VRM0/materialProperties.ts";
import { ColorUtils } from "@gltf-transform/core";
import { vec4 } from "@gltf-transform/core";
import { ColorPicker, Empty } from "antd";
import { EditorContext } from "../../providers/editorContextProvider.tsx";

export default function MaterialColorList({
  materialProperties,
}: {
  materialProperties: MaterialProperties | null;
}) {
  const editorContext = useContext(EditorContext);

  const linearVec4ToWebRGBAString = (linearVec4: vec4): string => {
    const srgbVec4 = ColorUtils.convertLinearToSRGB(linearVec4, [0, 0, 0, 1]);
    const [r, g, b, a] = srgbVec4;

    return `rgba(${[r * 255, g * 255, b * 255, a * 255].join(",")})`;
  };

  const webRGBAtoLinearVec4 = (rgba: RGBA): vec4 => {
    return [
      (rgba.r as number) / 255,
      (rgba.g as number) / 255,
      (rgba.b as number) / 255,
      rgba.a as number,
    ];
  };

  return (
    <>
      {materialProperties ? (
        <>
          <ColorPicker
            format="rgb"
            onChangeComplete={(color) => {
              const linearVec4 = webRGBAtoLinearVec4(color.toRgb());
              materialProperties.setMainColor(linearVec4);
              editorContext.rebuildVRMGLTF();
            }}
            showText={(color) => <span>Main {color.toRgbString()}</span>}
            value={linearVec4ToWebRGBAString(materialProperties.getMainColor())}
          />

          <ColorPicker
            format="rgb"
            onChangeComplete={(color) => {
              materialProperties.setOutlineColor(
                webRGBAtoLinearVec4(color.toRgb())
              );
              editorContext.rebuildVRMGLTF();
            }}
            showText={(color) => <span>Outline {color.toRgbString()}</span>}
            value={linearVec4ToWebRGBAString(
              materialProperties.getOutlineColor()
            )}
          />
        </>
      ) : (
        <Empty description="No Material Selected" />
      )}
    </>
  );
}
