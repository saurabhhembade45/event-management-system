import { motion } from 'framer-motion';
import { MapPin, Calendar as CalendarIcon, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="glass-card overflow-hidden group cursor-pointer h-full flex flex-col"
    >
      <div className="h-52 bg-[#0a0f1c] relative overflow-hidden">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full bg-gradient-premium opacity-30 group-hover:opacity-50 transition-opacity duration-500 flex items-center justify-center">
            <CalendarIcon size={56} className="text-white/60 drop-shadow-2xl" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 shadow-glass">
          {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col relative z-10 -mt-6 bg-[#030712]/40 backdrop-blur-3xl pt-8 rounded-t-3xl border-t border-white/5">
        <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1 tracking-tight">{event.title}</h3>
        <p className="text-gray-400 text-sm mb-5 line-clamp-2 flex-1 leading-relaxed">{event.description}</p>
        
        <div className="space-y-3 mb-6 text-sm font-medium text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5">
          <div className="flex items-center">
            <MapPin size={18} className="text-indigo-400 mr-3" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users size={18} className="text-purple-400 mr-3" />
            <span>Fee: <span className="text-white font-semibold">{event.registrationFee > 0 ? `₹${event.registrationFee}` : 'Free'}</span></span>
          </div>
        </div>
        
        <Link 
          to={`/events/${event._id}`}
          className="block w-full py-3 text-center rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 font-semibold transition-all duration-300 group-hover:shadow-glow"
        >
          View Event Details
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;
