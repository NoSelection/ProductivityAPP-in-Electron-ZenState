import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type WidgetId = 'timer' | 'media' | 'codex' | 'quest' | 'settings' | string;

export interface WidgetInstance {
  id: string;
  type: WidgetId;
  x: number; // Grid column
  y: number; // Grid row
  w: number; // Width
  h: number; // Height
  visible: boolean;
}

interface WorkspaceState {
  widgets: WidgetInstance[];
  isEditMode: boolean;
}

export type PageId = 'dashboard' | 'timer' | 'media' | 'codex' | 'quest' | 'settings' | 'profile';

interface WorkspaceContextType extends WorkspaceState {
  activePage: PageId;
  navigateTo: (page: PageId) => void;
  
  toggleEditMode: () => void;
  updateWidget: (id: string, updates: Partial<WidgetInstance>) => void;
  addWidget: (type: WidgetId) => void;
  removeWidget: (id: string) => void;
  moveWidget: (id: string, x: number, y: number) => void;
  resizeWidget: (id: string, w: number, h: number) => void;
  focusWidget: (type: WidgetId) => void;
}

const STORAGE_KEY = 'zen-workspace-layout';

const defaultWidgets: WidgetInstance[] = [
  { id: 'timer-1', type: 'timer', x: 0, y: 0, w: 3, h: 4, visible: true },
  { id: 'media-1', type: 'media', x: 3, y: 0, w: 3, h: 4, visible: true },
  { id: 'quest-1', type: 'quest', x: 6, y: 0, w: 6, h: 4, visible: true },
];

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultWidgets;
      }
    }
    return defaultWidgets;
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  const navigateTo = (page: PageId) => setActivePage(page);

  const toggleEditMode = () => setIsEditMode(prev => !prev);

  const updateWidget = (id: string, updates: Partial<WidgetInstance>) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const addWidget = (type: WidgetId) => {
    const id = `${type}-${Math.random().toString(36).substring(2, 6)}`;
    const newWidget: WidgetInstance = {
      id,
      type,
      x: 0,
      y: 0,
      w: 3,
      h: 4,
      visible: true
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const moveWidget = (id: string, _x: number, _y: number) => {
    setWidgets(prev => {
        const index = prev.findIndex(w => w.id === id);
        if (index === -1) return prev;
        const newWidgets = [...prev];
        const [removed] = newWidgets.splice(index, 1);
        if (_x > 0 || _y > 0) newWidgets.push(removed);
        else newWidgets.unshift(removed);
        return newWidgets;
    });
  };

  const resizeWidget = (id: string, w: number, h: number) => {
    updateWidget(id, { w: Math.max(1, w), h: Math.max(1, h) });
  };

  const focusWidget = (type: WidgetId) => {
    setWidgets(prev => {
      // Check if widget of type exists
      const existing = prev.find(w => w.type === type);
      if (existing) {
        // Move to top/visible (reorder to front effectively, or we could scroll to it)
        // For grid layout, "focus" might just mean ensuring it's there. 
        // Let's ensure it's visible if we had visibility toggles.
        // For now, let's just make sure it's in the list. 
        // If we want to "scroll" to it, we'd need a ref in the layout.
        // Let's just ensure it exists.
        return prev;
      }
      
      // If not exists, add it
      const id = `${type}-${Math.random().toString(36).substring(2, 6)}`;
      return [...prev, {
        id,
        type,
        x: 0,
        y: 0,
        w: type === 'codex' || type === 'quest' ? 6 : 3,
        h: 4,
        visible: true
      }];
    });
    
    // Dispatch a custom event for scrolling?
    setTimeout(() => {
        const element = document.getElementById(`widget-type-${type}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-2', 'ring-accent-highlight', 'ring-offset-2', 'ring-offset-transparent');
            setTimeout(() => element.classList.remove('ring-2', 'ring-accent-highlight', 'ring-offset-2', 'ring-offset-transparent'), 1000);
        }
    }, 100);
  };

  return (
    <WorkspaceContext.Provider value={{
      widgets,
      isEditMode,
      activePage,
      navigateTo,
      toggleEditMode,
      updateWidget,
      addWidget,
      removeWidget,
      moveWidget,
      resizeWidget,
      focusWidget
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}