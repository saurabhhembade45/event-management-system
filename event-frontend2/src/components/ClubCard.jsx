import { motion } from 'framer-motion';
import { Users, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClubCard = ({ club, onDelete }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => navigate(`/events?clubId=${club._id}`)}
      className="glass-card p-8 flex flex-col items-center text-center relative group cursor-pointer"
    >
      <div className="w-24 h-24 rounded-full bg-gradient-premium p-1 mb-5 shadow-glow-strong group-hover:scale-110 transition-transform duration-500 relative z-10">
        <div className="w-full h-full bg-[#030712] rounded-full flex items-center justify-center overflow-hidden border-2 border-transparent">
          {club.image ? (
             <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-white tracking-tighter">{club.name?.charAt(0)}</span>
          )}
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight z-10">{club.name}</h3>
      <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed z-10">{club.description}</p>
      
      <div className="mt-auto flex items-center justify-center w-full py-2 bg-white/5 rounded-xl text-indigo-400 text-sm font-semibold border border-white/5 z-10">
        <Users size={18} className="mr-2" />
        <span>Community</span>
      </div>

      {onDelete && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(club._id); }}
          className="absolute top-4 right-4 p-2.5 bg-rose-500/10 text-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white shadow-lg z-20"
          title="Delete Club"
        >
          <Trash2 size={16} />
        </button>
      )}
    </motion.div>
  );
};

export default ClubCard;
