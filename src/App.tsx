import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { MainLayout } from "./components/layout/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { FocusPage } from "./pages/FocusPage";
import { MediaPage } from "./pages/MediaPage";
import { QuestsPage } from "./pages/QuestsPage";
import { ZenGardenPage } from "./pages/ZenGardenPage";
import { NeuralCodex } from "./components/NeuralCodex";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/focus" element={<FocusPage />} />
            <Route path="/codex" element={<NeuralCodex />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/garden" element={<ZenGardenPage />} />
            <Route path="/quests" element={<QuestsPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;