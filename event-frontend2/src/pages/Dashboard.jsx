import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, TrendingUp, Activity } from 'lucide-react';
import StatCard from '../components/StatCard';
import EventCard from '../components/EventCard';
import { getAllEvents } from '../api/events';
import { getClubs } from '../api/clubs';
import { getAIRecommendations } from '../api/ai';
import Loader from '../components/Loader';
import AnalyticsStatsCard from '../components/analytics/StatsCard';
import LineChart from '../components/analytics/LineChart';
import PieChart from '../components/analytics/PieChart';
import { useAuth } from '../context/AuthContext';
import { getFormattedUserName } from '../utils/userUtils';

const Dashboard = () => {
  const { user } = useAuth();
  const displayName = getFormattedUserName(user);

  const [stats, setStats] = useState({ events: 0, clubs: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [eventsRes, clubsRes] = await Promise.all([
          getAllEvents(),
          getClubs()
        ]);
        
        const events = eventsRes.data.events || [];
        const clubs = clubsRes.data.clubs || [];
        
        setStats({ events: events.length, clubs: clubs.length });
        setRecentEvents(events.slice(0, 3));

        const aiRes = await getAIRecommendations();
        setAiRecommendations(aiRes.data.events || []);

      } catch (error) {
        console.error("Dashboard data fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <div>
        {/* Mobile & Tab only: Welcome user_name */}
        <p className="block md:hidden text-base sm:text-lg font-medium text-gray-300 mb-1">
          Welcome, <span className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-premium ml-0.5">{displayName}</span> 👋
        </p>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Here's what's happening in Eventopia today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Events" value={stats.events} icon={Calendar} trend={12} />
        <StatCard title="Active Clubs" value={stats.clubs} icon={Users} trend={5} />
        <StatCard title="Total Bookings" value="---" icon={TrendingUp} />
        <StatCard title="Platform Activity" value="High" icon={Activity} />
      </div>

      {/* AI Recommended Events */}
      <div className="mt-10 sm:mt-12">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            AI Recommended Events For You
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Based on your interests and previous participation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {aiRecommendations.length > 0 ? (
            aiRecommendations.map(event => (
              <EventCard key={event._id} event={event} />
            ))
          ) : (
            <p className="text-gray-400 col-span-full">
              No recommendations available yet.
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 sm:mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Upcoming Events</h2>
          <button className="text-indigo-400 hover:text-indigo-300 font-medium text-xs sm:text-sm">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {recentEvents.length > 0 ? (
            recentEvents.map(event => <EventCard key={event._id} event={event} />)
          ) : (
            <p className="text-gray-400 col-span-full">No events to display yet.</p>
          )}
        </div>
      </div>
      
      {/* Analytics Dashboard */}
      <div className="mt-12 sm:mt-16">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 tracking-tight">Analytics Overview</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <AnalyticsStatsCard title="Total Users" value="1,245" icon={Users} delay={0.1} />
          <AnalyticsStatsCard title="Total Events" value={stats.events} icon={Calendar} delay={0.2} />
          <AnalyticsStatsCard title="Total Bookings" value="3,892" icon={TrendingUp} delay={0.3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChart />
          <PieChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;