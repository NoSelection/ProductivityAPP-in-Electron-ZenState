import { useState, useEffect } from 'react';
import { Plus, Save, Trash2, FileText, ChevronRight } from 'lucide-react';
import { GlassButton } from '../atoms/GlassButton';
import { GlassInput } from '../atoms/GlassInput';
import { motion, AnimatePresence } from 'framer-motion';

interface CodexNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt?: number;
}

export const CodexWidget = () => {
  const [notes, setNotes] = useState<CodexNote[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const saved = await window.neuralDb.getCodexNotes();
    setNotes((saved as any) || []);
  };

  const activeNote = notes.find(n => n.id === activeNoteId);

  const createNote = () => {
    const newNote: CodexNote = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Untitled Entry',
      content: '',
      tags: [],
      updatedAt: Date.now()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateActiveNote = (updates: Partial<CodexNote>) => {
    if (!activeNoteId) return;
    setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, ...updates, updatedAt: Date.now() } : n));
  };

  const saveNote = async () => {
    if (!activeNote) return;
    setIsSaving(true);
    await window.neuralDb.saveCodexNote(activeNote as any);
    setTimeout(() => setIsSaving(false), 500);
  };

  const deleteNote = async (id: string) => {
    await window.neuralDb.deleteCodexNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) setActiveNoteId(null);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full gap-6 overflow-hidden">
      {/* Note List Sidebar */}
      <div className="w-64 flex flex-col gap-4 border-r border-border-subtle pr-4 h-full">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-display text-[var(--text-main)]">Codex</h3>
          <GlassButton size="icon" variant="ghost" className="w-8 h-8 rounded-lg" onClick={createNote}>
            <Plus size={16} />
          </GlassButton>
        </div>

        <GlassInput 
          placeholder="Search Codex..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="py-1.5 px-3 text-xs"
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
          {filteredNotes.map(note => (
            <button
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`
                w-full text-left p-3 rounded-xl transition-all duration-300 group
                ${activeNoteId === note.id ? 'bg-accent-highlight/10 border-accent-highlight/20 border' : 'bg-glass-base border border-transparent hover:border-border-subtle'}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium truncate ${activeNoteId === note.id ? 'text-accent-highlight' : 'text-[var(--text-main)] opacity-80'}`}>
                  {note.title}
                </span>
                <ChevronRight size={12} className={`transition-transform ${activeNoteId === note.id ? 'rotate-90 text-accent-highlight' : 'text-[var(--text-muted)]'}`} />
              </div>
              <p className="text-[10px] text-[var(--text-muted)] line-clamp-1 font-light italic">
                {note.content.substring(0, 40) || 'No content...'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <AnimatePresence mode="wait">
          {activeNote ? (
            <motion.div 
              key={activeNote.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <input
                  value={activeNote.title}
                  onChange={(e) => updateActiveNote({ title: e.target.value })}
                  className="bg-transparent border-none outline-none text-2xl font-display text-[var(--text-main)] w-full tracking-tight"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <GlassButton size="icon" variant="ghost" className="text-[var(--text-muted)] hover:text-red-400" onClick={() => deleteNote(activeNote.id)}>
                    <Trash2 size={16} />
                  </GlassButton>
                  <GlassButton 
                    variant={isSaving ? 'primary' : 'secondary'} 
                    size="sm" 
                    className="gap-2"
                    onClick={saveNote}
                  >
                    <Save size={14} className={isSaving ? 'animate-pulse' : ''} />
                    {isSaving ? 'Saving...' : 'Save'}
                  </GlassButton>
                </div>
              </div>

              <textarea
                value={activeNote.content}
                onChange={(e) => updateActiveNote({ content: e.target.value })}
                placeholder="Begin transmission..."
                className="flex-1 bg-transparent border-none outline-none resize-none text-[var(--text-main)] opacity-80 font-light leading-relaxed custom-scrollbar p-0 placeholder:text-[var(--text-muted)]"
              />
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20">
               <FileText size={48} strokeWidth={1} className="mb-4 text-[var(--text-main)]" />
               <p className="text-[10px] font-tech uppercase tracking-[0.3em] text-[var(--text-main)]">Neural Link Offline</p>
               <GlassButton variant="ghost" size="sm" className="mt-4" onClick={createNote}>Create New Entry</GlassButton>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
