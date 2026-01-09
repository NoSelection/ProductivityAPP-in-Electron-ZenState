import { motion } from 'framer-motion';
import { CodexWidget } from '../components/widgets/CodexWidget';
import { GlassPanel } from '../components/atoms/GlassPanel';

export const CodexPage = () => {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-full"
      >
        <GlassPanel className="w-full h-full p-8">
           <CodexWidget />
        </GlassPanel>
      </motion.div>
    </div>
  );
};
