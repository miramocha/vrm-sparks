import MaterialProperties from "../../gltf-transform-extensions/VRM0/materialProperties.ts";
import { ColorUtils } from "@gltf-transform/core";
import { ColorPicker, Empty } from "antd";

export default function MaterialColorList({
  materialProperties,
}: {
  materialProperties: MaterialProperties | null;
}) {
  return (
    <>
      {materialProperties ? (
        <>
          <ColorPicker
            format="rgb"
            showText={(color) => <span>Main ({color.toRgbString()})</span>}
            value={
              materialProperties.getMainColor()
                ? `rgba(${ColorUtils.convertSRGBToLinear(
                    materialProperties.getMainColor(),
                    [1, 1, 1, 1]
                  ).join(",")})`
                : null
            }
          />
        </>
      ) : (
        <Empty description="No Material Selected" />
      )}
    </>
  );
}
