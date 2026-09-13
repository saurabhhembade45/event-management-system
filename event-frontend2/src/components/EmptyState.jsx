import { motion } from 'framer-motion';

const EmptyState = ({ title, description, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
        {Icon && <Icon size={32} className="text-gray-400" />}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-sm">{description}</p>
    </motion.div>
  );
};

export default EmptyState;
