import { useContext, useEffect, useState } from "react";
import { Empty, Select } from "antd";
import { MToonMaterial } from "@pixiv/three-vrm";
import { GLTFTransformExtensionUtils } from "../utils/GLTFTransformExtensionUtils.ts";
import MaterialProperties from "../gltf-transform-extensions/VRM0/materialProperties.ts";
import MaterialTextureList from "./vrm0/MaterialTextureList.tsx";
import { EditorContext } from "../providers/editorContextProvider.tsx";
import MaterialColorList from "./vrm0/MaterialColorList.tsx";
// import { VRM as ThreeVRM } from "@pixiv/three-vrm";

type SelectOptions = { label?: string; value: number };

export default function VRM0MaterialEditor() {
  const editorContext = useContext(EditorContext);

  const [currentMaterialPropertiesIndex, setCurrentMaterialPropertiesIndex] =
    useState<number | null>(null);
  const [currentMaterialProperties, setCurrentMaterialProperties] =
    useState<MaterialProperties | null>(null);
  const [currentMToonMaterial, setCurrentMToonMaterial] =
    useState<MToonMaterial | null>(null);
  const [materialOptions, setMaterialOptions] = useState<SelectOptions[]>([]);

  useEffect(() => {
    setMaterialOptions(
      GLTFTransformExtensionUtils.listVRM0MaterialProperties(
        editorContext.gltfDocument!
      )?.map((materialProperties, index) => ({
        value: index,
        label: materialProperties?.getName() || "(No Name)",
      })) || []
    );
    setCurrentMaterialPropertiesIndex(null);
  }, [editorContext.gltfDocument]);

  useEffect(() => {
    setCurrentMaterialProperties(
      GLTFTransformExtensionUtils.getVRM0MaterialPropertiesByMaterialIndex(
        editorContext.gltfDocument!,
        currentMaterialPropertiesIndex!
      ) || null
    );
  }, [editorContext.gltfDocument, currentMaterialPropertiesIndex]);

  useEffect(() => {
    setCurrentMToonMaterial(
      (editorContext.threeGLTF?.userData.vrm?.materials?.at(
        currentMaterialPropertiesIndex!
      ) as MToonMaterial) || null
    );
  }, [editorContext.threeGLTF, currentMaterialPropertiesIndex]);

  return (
    <>
      {editorContext.gltfDocument ? (
        <>
          <Select
            value={currentMaterialPropertiesIndex}
            options={materialOptions}
            onChange={(index) => {
              setCurrentMaterialPropertiesIndex(index);
            }}
          />
          <MaterialTextureList materialProperties={currentMaterialProperties} />
          <MaterialColorList
            materialProperties={currentMaterialProperties}
            mToonMaterial={currentMToonMaterial}
          />
        </>
      ) : (
        <Empty description="No VRM Loaded" />
      )}
    </>
  );
}
