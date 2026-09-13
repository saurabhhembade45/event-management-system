import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

const defaultData = [
  { name: 'Tech', value: 45 },
  { name: 'Cultural', value: 30 },
  { name: 'Sports', value: 15 },
  { name: 'Others', value: 10 },
];

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 p-3 rounded-xl shadow-xl">
        <p className="text-gray-300 text-sm font-medium">
          <span className="font-bold mr-2 text-white" style={{ color: payload[0].payload.fill }}>
            {payload[0].name}:
          </span> 
          {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const PieChart = ({ data = defaultData, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl border border-white/10 p-6 h-96 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-6" />
        <div className="h-72 bg-white/5 rounded-full w-72 mx-auto" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card rounded-2xl border border-white/10 p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent opacity-50" />
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white mb-6">Category Distribution</h3>
        <div className="h-72 w-full flex items-center justify-center">
          {!data || data.length === 0 ? (
            <p className="text-gray-400">No data available for the selected period.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-gray-300 text-sm ml-1">{value}</span>}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PieChart;
