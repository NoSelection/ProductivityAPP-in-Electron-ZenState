import { motion } from 'framer-motion';
import { ProfileWidget } from '../components/widgets/ProfileWidget';
import { GlassPanel } from '../components/atoms/GlassPanel';

export const ProfilePage = () => {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl aspect-[16/10] max-h-[800px]"
      >
        <GlassPanel className="w-full h-full p-12">
           <ProfileWidget />
        </GlassPanel>
      </motion.div>
    </div>
  );
};
