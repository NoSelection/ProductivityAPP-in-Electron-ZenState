import { motion } from 'framer-motion';
import { QuestWidget } from '../components/widgets/QuestWidget';
import { GlassPanel } from '../components/atoms/GlassPanel';

export const QuestPage = () => {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl h-full max-h-[800px]"
      >
        <GlassPanel className="w-full h-full p-12">
           <QuestWidget />
        </GlassPanel>
      </motion.div>
    </div>
  );
};
