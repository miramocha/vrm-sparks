import { useContext, useEffect, useState } from "react";
import { Empty, Select, Tabs } from "antd";
import { MaterialMToonProp } from "../gltf-transform-extensions/material-mtoon-prop.ts";
import { GLTFTransformExtensionUtils } from "../utils/gltfTransformExtensionUtils.ts";
import MaterialTextureList from "./forms/MaterialTextureList.tsx";
import { EditorContext } from "../providers/editorContextProvider.tsx";
import MaterialColorList from "./forms/MaterialColorList.tsx";
import { Material } from "@gltf-transform/core";

type SelectOptions = { label?: string; value: number };

export default function MaterialEditor() {
  const editorContext = useContext(EditorContext);

  const [currentMaterialMToonIndex, setCurrentMaterialMToonIndex] = useState<
    number | null
  >(null);
  const [currentMaterialMToon, setCurrentMaterialMToon] =
    useState<MaterialMToonProp | null>(null);
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
    console.log("changing index to", currentMaterialMToonIndex);
    if (currentMaterialMToonIndex === null) {
      setCurrentMaterialMToon(null);
      setCurrentMaterial(null);
    } else {
      setCurrentMaterialMToon(
        GLTFTransformExtensionUtils.getMaterialMToonPropByMaterialIndex(
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
    }
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
          <Tabs
            defaultActiveKey="colors"
            items={[
              {
                label: "Colors",
                key: "colors",
                children: (
                  <MaterialColorList
                    materialMToon={currentMaterialMToon}
                    material={currentMaterial}
                  />
                ),
              },
              {
                label: "Textures",
                key: "textures",
                children: (
                  <MaterialTextureList
                    materialMToon={currentMaterialMToon}
                    material={currentMaterial}
                  />
                ),
              },
            ]}
          />
        </>
      ) : (
        <Empty description="No VRM Loaded" />
      )}
    </>
  );
}
