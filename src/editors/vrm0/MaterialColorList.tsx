import { useContext } from "react";
import { RGBA } from "@ctrl/tinycolor";
import MaterialMToon from "../../gltf-transform-extensions/VRM0/materialMtoon.ts";
import { ColorUtils, vec3, Material } from "@gltf-transform/core";
import { vec4 } from "@gltf-transform/core";
import { ColorPicker, Empty } from "antd";
import { EditorContext } from "../../providers/editorContextProvider.tsx";

export default function MaterialColorList({
  materialMToon,
  material,
}: {
  materialMToon: MaterialMToon | null;
  material: Material | null;
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
      {material ? (
        <>
          <ColorPicker
            format="rgb"
            onChangeComplete={(color) => {
              const linearVec4 = webRGBAtoLinearVec4(color.toRgb());
              material.setBaseColorFactor(linearVec4);
              editorContext.rebuildVRMGLTF();
            }}
            showText={(color) => <span>Main {color.toRgbString()}</span>}
            value={linearVec4ToWebRGBAString(material.getBaseColorFactor())}
          />
          <ColorPicker
            format="rgb"
            onChangeComplete={(color) => {
              const linearVec4 = webRGBAtoLinearVec4(color.toRgb());
              material.setEmissiveFactor(linearVec4.slice(0, 3) as vec3);
              editorContext.rebuildVRMGLTF();
            }}
            showText={(color) => <span>Emissive {color.toRgbString()}</span>}
            value={linearVec4ToWebRGBAString([
              ...material.getEmissiveFactor(),
              1,
            ])}
          />
        </>
      ) : null}
      {materialMToon ? (
        <>
          <ColorPicker
            format="rgb"
            onChangeComplete={(color) => {
              materialMToon.setOutlineColorFactor(
                webRGBAtoLinearVec4(color.toRgb()).slice(0, 3) as vec3
              );
              editorContext.rebuildVRMGLTF();
            }}
            showText={(color) => <span>Outline {color.toRgbString()}</span>}
            value={linearVec4ToWebRGBAString([
              ...materialMToon.getOutlineColorFactor(),
              1,
            ] as vec4)}
          />
        </>
      ) : (
        <Empty description="No Material Selected" />
      )}
    </>
  );
}
