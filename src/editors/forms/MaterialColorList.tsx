import { useContext, useEffect } from "react";
import { Color as RcColor } from "@rc-component/color-picker";
import { MaterialMToonProp } from "../../gltf-transform-extensions/material-mtoon-prop.ts";
import { ColorUtils, Material } from "@gltf-transform/core";
import { vec3, vec4 } from "@gltf-transform/core";
import { Button, ColorPicker, Empty, Form } from "antd";
import { EditorContext } from "../../providers/editorContextProvider.tsx";

export default function MaterialColorList({
  materialMToon,
  material,
}: {
  materialMToon: MaterialMToonProp | null;
  material: Material | null;
}) {
  const editorContext = useContext(EditorContext);

  const linearToWebRGBAString = (linear: vec3 | vec4): string => {
    let normalizedLinear;
    if (linear.length === 3) {
      normalizedLinear = [...linear, 1];
    } else {
      normalizedLinear = linear;
    }
    const srgbVec4 = ColorUtils.convertLinearToSRGB(
      normalizedLinear,
      [0, 0, 0, 1]
    );
    const [r, g, b, a] = srgbVec4;

    return `rgba(${[r * 255, g * 255, b * 255, a * 255].join(",")})`;
  };

  type Color = { metaColor: RcColor };
  const colorToLinearVec4 = (color: Color): vec4 => {
    const srgbVec4 = [
      (color.metaColor.r as number) / 255,
      (color.metaColor.g as number) / 255,
      (color.metaColor.b as number) / 255,
      (color.metaColor.a as number) || 1,
    ];

    const linearVec4 = ColorUtils.convertSRGBToLinear(
      srgbVec4,
      [0, 0, 0, 1]
    ) as vec4;

    console.log(srgbVec4, linearVec4);

    return linearVec4;
  };

  const [form] = Form.useForm();
  const handleFormSubmit = (values: {
    baseColorFactor?: string | Color;
    emissiveFactor?: string | Color;
    shadeColorFactor?: string | Color;
    outlineColorFactor?: string | Color;
    parametricRimColorFactor?: string | Color;
    matcapFactor?: string | Color;
  }) => {
    console.log(values);
    // material?.setBaseColorFactor(
    //   webRGBAtoLinearVec4(values.baseColorFactor?.at(1)!)!
    // );
    if (values.baseColorFactor && typeof values.baseColorFactor !== "string") {
      console.log(typeof values.baseColorFactor);
      material?.setBaseColorFactor(
        colorToLinearVec4(values.baseColorFactor as Color)
      );
    }
    if (values.emissiveFactor instanceof RcColor) {
      material?.setEmissiveFactor(
        colorToLinearVec4(values.emissiveFactor as Color).slice(0, 3) as vec3
      );
    }
    editorContext.rebuildVRMGLTF();
  };

  useEffect(() => {
    if (material) {
      form.setFieldValue(
        "baseColorFactor",
        linearToWebRGBAString(material.getBaseColorFactor())
      );
      form.setFieldValue(
        "emissiveFactor",
        linearToWebRGBAString(material.getEmissiveFactor())
      );
    }

    if (materialMToon) {
      form.setFieldValue(
        "shadeColorFactor",
        linearToWebRGBAString(materialMToon.getShadeColorFactor())
      );
      form.setFieldValue(
        "outlineColorFactor",
        linearToWebRGBAString(materialMToon.getOutlineColorFactor())
      );
      form.setFieldValue(
        "parametricRimColorFactor",
        linearToWebRGBAString(materialMToon.getParametricRimColorFactor())
      );
      form.setFieldValue(
        "matcapFactor",
        linearToWebRGBAString(materialMToon.getMatcapFactor())
      );
    }
  }, [form, material, materialMToon]);

  return (
    <>
      {material ? (
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Form.Item label="Base" name="baseColorFactor">
            <ColorPicker
              format="rgb"
              showText={(color) => <span>{color.toRgbString()}</span>}
              size="large"
            />
          </Form.Item>
          <Form.Item label="Emissive" name="emissiveFactor">
            <ColorPicker
              format="rgb"
              showText={(color) => <span>{color.toRgbString()}</span>}
              size="large"
            />
          </Form.Item>
          {materialMToon ? (
            <>
              <Form.Item label="Shade" name="shadeColorFactor">
                <ColorPicker
                  format="rgb"
                  showText={(color) => <span>{color.toRgbString()}</span>}
                  size="large"
                  disabledAlpha
                />
              </Form.Item>
              <Form.Item label="Outline" name="outlineColorFactor">
                <ColorPicker
                  format="rgb"
                  showText={(color) => <span>{color.toRgbString()}</span>}
                  size="large"
                  disabledAlpha
                />
              </Form.Item>
              <Form.Item label="Matcap" name="matcapFactor">
                <ColorPicker
                  format="rgb"
                  showText={(color) => <span>{color.toRgbString()}</span>}
                  size="large"
                  disabledAlpha
                />
              </Form.Item>
              <Form.Item label="Rim" name="parametricRimColorFactor">
                <ColorPicker
                  format="rgb"
                  showText={(color) => <span>{color.toRgbString()}</span>}
                  size="large"
                  disabledAlpha
                />
              </Form.Item>
            </>
          ) : null}
          <Button type="primary" htmlType="submit" block>
            Apply Changes
          </Button>
        </Form>
      ) : (
        <Empty description="No Material Selected" />
      )}
    </>
  );
}
