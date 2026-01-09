import React from 'react';
import { useWorkspace, WidgetInstance } from '../features/workspace/WorkspaceContext';
import { GlassPanel } from '../components/atoms/GlassPanel';
import { GlassButton } from '../components/atoms/GlassButton';
import { TimerWidget } from '../components/widgets/TimerWidget';
import { MediaWidget } from '../components/widgets/MediaWidget';
import { QuestWidget } from '../components/widgets/QuestWidget';
import { CodexWidget } from '../components/widgets/CodexWidget';
import { SettingsWidget } from '../components/widgets/SettingsWidget';
import { cn } from '../lib/utils';
import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';

const WidgetRenderer: React.FC<{ widget: WidgetInstance }> = ({ widget }) => {
  switch (widget.type) {
    case 'timer': return <TimerWidget />;
    case 'media': return <MediaWidget />;
    case 'quest': return <QuestWidget />;
    case 'codex': return <CodexWidget />;
    case 'settings': return <SettingsWidget />;
    default:
      return (
        <div className="flex-1 flex flex-col justify-center items-center">
          <h3 className="text-white font-display text-2xl tracking-tighter opacity-80">
            {widget.id}
          </h3>
          <p className="text-white/30 text-xs mt-2 font-light">
            Widget Placeholder ({widget.type})
          </p>
        </div>
      );
  }
};

export const GridLayout: React.FC = () => {
  const { widgets, isEditMode, resizeWidget, removeWidget, addWidget, moveWidget } = useWorkspace();

  return (
    <div className="w-full h-full p-4 lg:p-8 relative overflow-y-auto overflow-x-hidden custom-scrollbar">
      <LayoutGroup>
        {/* Grid Container */}
        <div className="grid grid-cols-12 gap-4 lg:gap-8 auto-rows-[minmax(150px,auto)] max-w-[1600px] mx-auto pb-32">
          <AnimatePresence mode="popLayout">
            {widgets.filter(w => w.visible).map((widget, index) => (
              <motion.div
                key={widget.id}
                id={`widget-type-${widget.type}`}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  layout: { duration: 0.3, ease: "easeOut" }
                }}
                className="flex"
                style={{
                  gridColumn: `span ${widget.w}`,
                  gridRow: `span ${widget.h}`,
                }}
              >
                <GlassPanel
                  variant={isEditMode ? 'active' : 'frosted'}
                  hoverable={!isEditMode}
                  className={cn(
                    'p-8 flex flex-col min-h-[400px] w-full',
                    isEditMode && 'ring-2 ring-accent-highlight/20'
                  )}
                >
                  {isEditMode && (
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className="text-accent-secondary text-[10px] font-tech uppercase tracking-[0.2em]">
                          {widget.type}
                        </div>
                        <button 
                          onClick={() => removeWidget(widget.id)}
                          className="p-1 text-red-400/50 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                         <div className="flex flex-col items-center">
                            <span className="text-[8px] text-white/20 uppercase font-tech mb-1">Move</span>
                            <div className="grid grid-cols-3 gap-1">
                              <div />
                              <button onClick={() => moveWidget(widget.id, widget.x, widget.y - 1)} className="p-1 hover:bg-white/5 text-white/40"><ChevronUp size={10} /></button>
                              <div />
                              <button onClick={() => moveWidget(widget.id, widget.x - 1, widget.y)} className="p-1 hover:bg-white/5 text-white/40"><ChevronLeft size={10} /></button>
                              <div />
                              <button onClick={() => moveWidget(widget.id, widget.x + 1, widget.y)} className="p-1 hover:bg-white/5 text-white/40"><ChevronRight size={10} /></button>
                              <div />
                              <button onClick={() => moveWidget(widget.id, widget.x, widget.y + 1)} className="p-1 hover:bg-white/5 text-white/40"><ChevronDown size={10} /></button>
                              <div />
                            </div>
                         </div>
                         
                         <div className="flex flex-col items-center">
                            <span className="text-[8px] text-white/20 uppercase font-tech mb-1">Size</span>
                            <div className="grid grid-cols-2 gap-1 border border-white/5 rounded-lg overflow-hidden p-1">
                              <button onClick={() => resizeWidget(widget.id, widget.w - 1, widget.h)} className="p-1 hover:bg-white/5 text-white/40"><ChevronLeft size={10} /></button>
                              <button onClick={() => resizeWidget(widget.id, widget.w + 1, widget.h)} className="p-1 hover:bg-white/5 text-white/40"><ChevronRight size={10} /></button>
                              <button onClick={() => resizeWidget(widget.id, widget.w, widget.h - 1)} className="p-1 hover:bg-white/5 text-white/40"><ChevronUp size={10} /></button>
                              <button onClick={() => resizeWidget(widget.id, widget.w, widget.h + 1)} className="p-1 hover:bg-white/5 text-white/40"><ChevronDown size={10} /></button>
                            </div>
                         </div>
                      </div>
                    </div>
                  )}

                  <WidgetRenderer widget={widget} />
                  
                  {isEditMode && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-accent-highlight/50" />
                  )}
                </GlassPanel>
              </motion.div>
            ))}
          </AnimatePresence>

          {isEditMode && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ gridColumn: 'span 3' }}
            >
              <GlassPanel 
                variant="clear" 
                className="border-dashed border-2 border-[var(--text-muted)]/30 flex flex-col items-center justify-center min-h-[400px] gap-6 h-full p-6"
              >
                 <div className="text-[10px] font-tech text-[var(--text-muted)] uppercase tracking-widest">Add Component</div>
                 <div className="flex flex-wrap justify-center gap-3">
                    <GlassButton size="sm" onClick={() => addWidget('timer')}>Timer</GlassButton>
                    <GlassButton size="sm" onClick={() => addWidget('media')}>Media</GlassButton>
                    <GlassButton size="sm" onClick={() => addWidget('quest')}>Quest</GlassButton>
                    <GlassButton size="sm" onClick={() => addWidget('codex')}>Codex</GlassButton>
                    <GlassButton size="sm" onClick={() => addWidget('settings')}>Settings</GlassButton>
                 </div>
              </GlassPanel>
            </motion.div>
          )}
        </div>
      </LayoutGroup>

      {/* Background Hints for Edit Mode */}
      {isEditMode && (
        <div className="absolute inset-0 -z-10 grid grid-cols-12 gap-8 p-8 pointer-events-none opacity-20 max-w-[1600px] mx-auto">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border border-dashed border-white/10 rounded-[2rem] h-80" />
          ))}
        </div>
      )}
    </div>
  );
};
