import { useState, useEffect } from 'react';
import { WorkspaceProvider } from './features/workspace/WorkspaceContext';
import { ThemeProvider } from './features/theme/ThemeContext';
import { MainLayout } from './layout/MainLayout';
import { ArtifactLayout } from './layout/ArtifactLayout';
import { TimerWidget } from './components/widgets/TimerWidget';

function App() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handlehashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handlehashChange);
    return () => window.removeEventListener('hashchange', handlehashChange);
  }, []);

  const isArtifact = route.startsWith('#/artifact');

  return (
    <ThemeProvider>
      <WorkspaceProvider>
        {isArtifact ? (
          <ArtifactLayout>
            {route === '#/artifact/timer' && <TimerWidget isArtifact={true} />}
          </ArtifactLayout>
        ) : (
          <MainLayout />
        )}
      </WorkspaceProvider>
    </ThemeProvider>
  );
}

export default App;
