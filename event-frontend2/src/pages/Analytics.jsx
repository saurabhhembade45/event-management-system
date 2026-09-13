import { useState, useEffect } from 'react';
import { Users, Calendar, TrendingUp, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnalyticsStatsCard from '../components/analytics/StatsCard';
import LineChart from '../components/analytics/LineChart';
import PieChart from '../components/analytics/PieChart';
import Loader from '../components/Loader';
import { getAllEvents } from '../api/events';

const Analytics = () => {
  const [stats, setStats] = useState({ events: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const isAdmin = user?.email === 'saurabhhembade9518@gmail.com';

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const eventsRes = await getAllEvents();
        const events = eventsRes.data.events || [];
        setStats({ events: events.length });
      } catch (error) {
        console.error("Analytics data fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Access Restricted</h2>
        <p className="text-gray-400 max-w-md">This Analytics Dashboard contains administrative data and is only visible to the platform Admin.</p>
      </div>
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Analytics Dashboard</h1>
        <p className="text-gray-400">Detailed insights and performance metrics for Eventopia.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AnalyticsStatsCard title="Total Users" value="1,245" icon={Users} delay={0.1} />
        <AnalyticsStatsCard title="Total Events" value={stats.events} icon={Calendar} delay={0.2} />
        <AnalyticsStatsCard title="Total Bookings" value="3,892" icon={TrendingUp} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart />
        <PieChart />
      </div>
    </div>
  );
};

export default Analytics;
