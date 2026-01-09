import { motion } from 'framer-motion';
import { QuestWidget } from '../components/widgets/QuestWidget';
import { GlassPanel } from '../components/atoms/GlassPanel';

export const QuestPage = () => {
  return (
    <div className="h-full w-full flex justify-center p-8 pt-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl h-[85vh]"
      >
        <GlassPanel className="w-full h-full p-12">
           <QuestWidget />
        </GlassPanel>
      </motion.div>
    </div>
  );
};
