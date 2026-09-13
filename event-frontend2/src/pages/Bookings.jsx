import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { getMyParticipations } from '../api/participants';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import CalendarView from '../components/bookings/CalendarView';
import DownloadButton from '../components/bookings/DownloadButton';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Map real backend `bookings` into the structure required by Calendar and CSV
  const calendarData = bookings
    .filter(b => b.event && b.event.date)
    .map(b => {
      let eventDate;
      try {
        eventDate = new Date(b.event.date);
        if (isNaN(eventDate.valueOf())) throw new Error();
      } catch {
        eventDate = new Date(); // fallback if date parsing fails
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const normalizedEventDate = new Date(eventDate);
      normalizedEventDate.setHours(0, 0, 0, 0);

      return {
        id: b._id,
        title: b.event.title,
        date: eventDate.toISOString().split('T')[0],
        time: b.event.time || 'TBD',
        status: normalizedEventDate >= today ? 'Upcoming' : 'Completed'
      };
    });

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">My Bookings</h2>
          <p className="text-gray-400">Track your upcoming events and download your participation history.</p>
        </div>
        <DownloadButton data={calendarData} />
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-6">Calendar View</h3>
        <CalendarView events={calendarData} />
      </div>

      <div className="pt-4 border-t border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">Booking Details</h3>

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

export default Bookings;
