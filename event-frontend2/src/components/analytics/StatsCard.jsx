import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden rounded-2xl glass-card border border-white/10 p-6 group cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors duration-500" />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium tracking-wide mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className="bg-white/5 p-3 rounded-xl border border-white/5 shadow-inner">
          <Icon className="text-indigo-400 w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
