import { useContext, useEffect, useState } from "react";
import { Empty, Select } from "antd";
import MaterialMToon from "../gltf-transform-extensions/VRM0/materialMtoon.ts";
import { GLTFTransformExtensionUtils } from "../utils/GLTFTransformExtensionUtils.ts";
import MaterialTextureList from "./vrm0/MaterialTextureList.tsx";
import { EditorContext } from "../providers/editorContextProvider.tsx";
import MaterialColorList from "./vrm0/MaterialColorList.tsx";
import { Material } from "@gltf-transform/core";

type SelectOptions = { label?: string; value: number };

export default function VRM0MaterialEditor() {
  const editorContext = useContext(EditorContext);

  const [currentMaterialMToonIndex, setCurrentMaterialMToonIndex] = useState<
    number | null
  >(null);
  const [currentMaterialMToon, setCurrentMaterialMToon] =
    useState<MaterialMToon | null>(null);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [materialOptions, setMaterialOptions] = useState<SelectOptions[]>([]);

  useEffect(() => {
    setMaterialOptions(
      editorContext.gltfDocument
        ?.getRoot()
        .listMaterials()
        ?.map((material, index) => ({
          value: index,
          label: material.getName() || "(No Name)",
        })) || []
    );
    setCurrentMaterialMToonIndex(null);
  }, [editorContext.gltfDocument]);

  useEffect(() => {
    setCurrentMaterialMToon(
      GLTFTransformExtensionUtils.getVRM0MaterialMToonByMaterialIndex(
        editorContext.gltfDocument!,
        currentMaterialMToonIndex!
      ) || null
    );
    setCurrentMaterial(
      editorContext.gltfDocument
        ?.getRoot()
        ?.listMaterials()
        ?.at(currentMaterialMToonIndex!) || null
    );
  }, [editorContext.gltfDocument, currentMaterialMToonIndex]);

  return (
    <>
      {editorContext.gltfDocument ? (
        <>
          <Select
            value={currentMaterialMToonIndex}
            options={materialOptions}
            onChange={(index) => {
              setCurrentMaterialMToonIndex(index);
            }}
          />
          <MaterialTextureList
            materialMToon={currentMaterialMToon}
            material={currentMaterial}
          />
          <MaterialColorList
            materialMToon={currentMaterialMToon}
            material={currentMaterial}
          />
        </>
      ) : (
        <Empty description="No VRM Loaded" />
      )}
    </>
  );
}
