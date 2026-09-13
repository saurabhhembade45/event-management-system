import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bookmark, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyParticipations } from '../api/participants';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayName = user?.username || user?.email?.split('@')[0] || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getMyParticipations();
        setBookings(res.data.participations || []);
      } catch (error) {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-4 sm:p-8 flex flex-col md:flex-row items-center gap-4 sm:gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-premium opacity-20"></div>

        <div className="w-32 h-32 rounded-full bg-gradient-premium p-1 z-10">
          <div className="w-full h-full bg-[#0f172a] rounded-full flex items-center justify-center text-4xl font-bold text-white uppercase">
            {avatarLetter}
          </div>
        </div>

        <div className="z-10 text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">{displayName}</h1>
          <p className="text-gray-400 mb-4">{user?.email}</p>

          <div className="flex justify-center md:justify-start">
            <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm font-medium border border-indigo-500/30">
              {user?.email === 'saurabhhembade9518@gmail.com' ? 'Admin' : (user?.role || 'User')}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="z-10 flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">My Bookings</h2>

        {bookings.length > 0 ? (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking._id}
                whileHover={{ scale: 1.01 }}
                className="glass-card p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {booking.event?.image ? (
                    <img src={booking.event.image} alt={booking.event.title} className="w-14 h-14 rounded-lg object-cover bg-gray-800" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Bookmark size={24} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white tracking-tight text-lg">{booking.event?.title || 'Unknown Event'}</h3>
                    <p className="text-sm text-gray-400">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Link to={`/events/${booking.event?._id}`} className="text-indigo-400 text-sm hover:underline font-medium">
                  View Event
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Bookmark}
            title="No Bookings Yet"
            description="You haven't booked any events yet. Explore events and join the fun!"
          />
        )}
      </div>
    </div>
  );
};

export default Profile;