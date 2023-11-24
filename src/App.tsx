import "./App.css";
import { ConfigProvider, theme } from "antd";
import EditorContextProvider from "./providers/editorContextProvider.tsx";
import Renderer from "./renderer.tsx";
import FloatingMenu from "./floatingMenu.tsx";

function App() {
  return (
    <div className="App">
      <EditorContextProvider>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >
          <Renderer />
          <FloatingMenu />
        </ConfigProvider>
      </EditorContextProvider>
    </div>
  );
}

export default App;
