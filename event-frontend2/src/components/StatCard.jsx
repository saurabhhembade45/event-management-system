import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-gray-400 text-sm font-semibold tracking-wider uppercase mb-2">{title}</p>
          <h3 className="text-4xl font-extrabold text-white tracking-tight">{value}</h3>
          {trend && (
            <p className={`text-sm mt-3 flex items-center font-medium ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span className={`inline-block mr-1 ${trend > 0 ? 'bg-emerald-400/20' : 'bg-rose-400/20'} px-1.5 py-0.5 rounded-md`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </p>
          )}
        </div>
        <div className="w-14 h-14 rounded-2xl bg-gradient-premium flex items-center justify-center text-white shadow-glow-strong">
          <Icon size={28} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
