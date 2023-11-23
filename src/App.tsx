import "./App.css";
import { ConfigProvider, theme } from "antd";
import AppContextProvider from "./providers/appContextProvider.tsx";
import EditorContextProvider from "./providers/editorContextProvider.tsx";
import Renderer from "./renderer.tsx";
import FloatingMenu from "./floatingMenu.tsx";

function App() {
  return (
    <div className="App">
      <AppContextProvider>
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
      </AppContextProvider>
    </div>
  );
}

export default App;
