import "./App.css";
import { ConfigProvider, theme } from "antd";
import AppContextProvider from "./providers/appContextProvider.tsx";
import Renderer from "./renderer.tsx";
import FloatingMenu from "./floatingMenu.tsx";

function App() {
  return (
    <div className="App">
      <AppContextProvider>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >
          <Renderer />
          <FloatingMenu />
        </ConfigProvider>
      </AppContextProvider>
    </div>
  );
}

export default App;
