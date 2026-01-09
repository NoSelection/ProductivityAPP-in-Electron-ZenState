import { WorkspaceProvider } from './features/workspace/WorkspaceContext';
import { ThemeProvider } from './features/theme/ThemeContext';
import { MainLayout } from './layout/MainLayout';

function App() {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <MainLayout />
      </WorkspaceProvider>
    </ThemeProvider>
  );
}

export default App;
