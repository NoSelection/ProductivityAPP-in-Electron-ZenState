import { motion } from 'framer-motion';
import { SettingsWidget } from '../components/widgets/SettingsWidget';
import { GlassPanel } from '../components/atoms/GlassPanel';

export const SettingsPage = () => {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl h-full max-h-[700px]"
      >
        <GlassPanel className="w-full h-full p-12">
           <SettingsWidget />
        </GlassPanel>
      </motion.div>
    </div>
  );
};
