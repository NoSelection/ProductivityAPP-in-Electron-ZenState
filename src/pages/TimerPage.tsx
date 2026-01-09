import { motion } from 'framer-motion';
import { TimerWidget } from '../components/widgets/TimerWidget';
import { GlassPanel } from '../components/atoms/GlassPanel';

export const TimerPage = () => {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl aspect-square max-h-[600px]"
      >
        <GlassPanel className="w-full h-full p-12">
           <TimerWidget />
        </GlassPanel>
      </motion.div>
    </div>
  );
};
