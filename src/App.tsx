import { ThemeProvider } from "./context/ThemeContext";
import { Layout } from "./components/Layout";
import { FocusCard } from "./components/FocusCard";
import { Timer } from "./components/Timer";
import { BrainDump } from "./components/BrainDump";
import { MediaDeck } from "./components/MediaDeck";
import { QuestLog } from "./components/QuestLog";

function App() {
  return (
    <ThemeProvider>
      <Layout>
        {/* Top Left - Focus */}
        <FocusCard />

        {/* Top Right (Middle Column Top) - Timer */}
        <Timer />

        {/* Sidebar - Spans 2 Rows (Rightmost column) */}
        <QuestLog />

        {/* Bottom Left - Brain Dump */}
        <BrainDump />

        {/* Bottom Right (Middle Column Bottom) - LoFi */}
        <MediaDeck />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
