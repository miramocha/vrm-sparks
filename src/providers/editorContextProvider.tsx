import {
  createContext,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from "react";
import { VRM as ThreeVRM } from "@pixiv/three-vrm";
import { GLTF as ThreeGLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Document as GLTFDocument } from "@gltf-transform/core";
import { LoaderUtils } from "../utils/LoaderUtils.ts";
import { GLTFTransformExtensionUtils } from "../utils/GLTFTransformExtensionUtils.ts";

type EditorContextController = {
  gltfDocument: GLTFDocument | null;
  threeGLTF: ThreeGLTF | null;
  getThreeVRM: () => ThreeVRM;
  readVRMGLTFDocumentFromFile: (file: File) => Promise<void>;
  loadThreeVRMFromFile: (file: File) => Promise<void>;
  rebuildVRMGLTF: () => Promise<void>;
};

export const EditorContext = createContext({} as EditorContextController);

export default function EditorContextProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [gltfDocument, setGLTFDocument] = useState<GLTFDocument | null>(null);
  const [threeGLTF, setThreeGLTF] = useState<ThreeGLTF | null>(null);

  const loadThreeVRMFromFile = useCallback(async (file: File) => {
    setThreeGLTF(await LoaderUtils.loadThreeVRM(file));
  }, []);

  const readVRMGLTFDocumentFromFile = useCallback(async (file: File) => {
    setGLTFDocument(
      await GLTFTransformExtensionUtils.readVRMGLTFDocumentFromFile(file)
    );
  }, []);

  const rebuildVRMGLTF = useCallback(async () => {
    console.log("rebuilding...");
    loadThreeVRMFromFile(
      await GLTFTransformExtensionUtils.writeVRMGLTFDocumentToFile(
        gltfDocument!,
        "exportedVRM.vrm"
      )
    );
  }, [gltfDocument, loadThreeVRMFromFile]);

  const contextValue = useMemo(
    () =>
      ({
        gltfDocument,
        threeGLTF,
        readVRMGLTFDocumentFromFile,
        loadThreeVRMFromFile,
        rebuildVRMGLTF,
      } as EditorContextController),
    [
      gltfDocument,
      threeGLTF,
      readVRMGLTFDocumentFromFile,
      loadThreeVRMFromFile,
      rebuildVRMGLTF,
    ]
  );

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
}
