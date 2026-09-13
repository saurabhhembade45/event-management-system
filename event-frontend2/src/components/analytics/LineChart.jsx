import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const defaultData = [
  { date: 'Mon', bookings: 12 },
  { date: 'Tue', bookings: 19 },
  { date: 'Wed', bookings: 15 },
  { date: 'Thu', bookings: 22 },
  { date: 'Fri', bookings: 28 },
  { date: 'Sat', bookings: 35 },
  { date: 'Sun', bookings: 42 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 p-3 rounded-xl shadow-xl">
        <p className="text-gray-300 text-sm font-medium mb-1">{label}</p>
        <p className="text-indigo-400 font-bold">
          {payload[0].value} Bookings
        </p>
      </div>
    );
  }
  return null;
};

const LineChart = ({ data = defaultData, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl border border-white/10 p-6 h-96 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-6" />
        <div className="h-72 bg-white/5 rounded-xl w-full" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-card rounded-2xl border border-white/10 p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-50" />
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white mb-6">Bookings Over Time</h3>
        <div className="h-72 w-full flex items-center justify-center">
          {!data || data.length === 0 ? (
            <p className="text-gray-400">No data available for the selected period.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorBookings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LineChart;
