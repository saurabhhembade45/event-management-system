import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { getAllEvents, createEvent, getClubEvents } from '../api/events';
import { getClubs } from '../api/clubs';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import GradientButton from '../components/GradientButton';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-hot-toast';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(searchParams.get('create') === 'true');
  const clubIdParam = searchParams.get('clubId');
  const searchQuery = searchParams.get('search') || '';

  const [newEvent, setNewEvent] = useState({
    title: '', description: '', date: '', time: '', location: '', registrationFee: '', clubId: '', image: null
  });

  const { user } = useAuth();
  const isAdmin = user?.email === 'saurabhhembade9518@gmail.com';

  // ✅ FIXED FUNCTION (ONLY CHANGE)
  const fetchInitialData = async () => {
    try {
      const [eventsRes, clubsRes] = await Promise.all([
        clubIdParam ? getClubEvents(clubIdParam) : getAllEvents(),
        getClubs()
      ]);

      setEvents(eventsRes.data.events || []);
      setClubs(clubsRes.data.clubs || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [clubIdParam]);

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    (event.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.image) {
      return toast.error("Please provide an event image");
    }
    try {
      const formData = new FormData();
      Object.keys(newEvent).forEach(key => {
        formData.append(key, newEvent[key]);
      });
      await createEvent(formData);
      toast.success('Event created successfully');
      setIsModalOpen(false);
      setSearchParams({});
      fetchInitialData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Explore Events</h1>
          <p className="text-gray-400">Discover what's happening around you.</p>
        </div>
        {isAdmin && (
          <GradientButton onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={18} />
            <span>Post an Event</span>
          </GradientButton>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No Events Found"
          description={searchQuery ? "No events match your search." : "It looks a bit quiet here. Be the first to host an event!"}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSearchParams({}); }}
        title="Post an Event"
      >
        <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
          {/* Event Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Event Title</label>
            <input
              type="text" required placeholder="e.g. Hack-a-Bit 2.0"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Club Hosting */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Club Hosting</label>
            <select
              required
              value={newEvent.clubId}
              onChange={(e) => setNewEvent({ ...newEvent, clubId: e.target.value })}
              className="w-full bg-[#1a2540] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">Select a club</option>
              {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Description</label>
            <textarea
              required rows={3} placeholder="What is this event about?"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Section label */}
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 border-b border-white/5 pb-1.5">
            Date &amp; Time
          </p>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Date</label>
              <input
                type="date" required
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Time</label>
              <input
                type="time" required
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Section label */}
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 border-b border-white/5 pb-1.5">
            Location &amp; Fee
          </p>

          {/* Location + Fee */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Location</label>
              <input
                type="text" required placeholder="e.g. Main Auditorium"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Fee (₹)</label>
              <input
                type="number" required placeholder="0 for free" min="0"
                value={newEvent.registrationFee}
                onChange={(e) => setNewEvent({ ...newEvent, registrationFee: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Event Banner Image</label>
            <input
              type="file" required accept="image/*"
              onChange={(e) => setNewEvent({ ...newEvent, image: e.target.files[0] })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30"
            />
            <span className="text-[11px] text-slate-500">JPG, PNG or WEBP · max 5 MB</span>
          </div>

          <GradientButton type="submit" className="w-full py-3 mt-1">
            Save Event
          </GradientButton>

        </form>
      </Modal>
    </div>
  );
};

export default Events;