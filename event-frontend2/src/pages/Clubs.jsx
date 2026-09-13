import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users } from 'lucide-react';
import { getClubs, createClub, deleteClub } from '../api/clubs';
import { useAuth } from '../context/AuthContext';
import ClubCard from '../components/ClubCard';
import GradientButton from '../components/GradientButton';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-hot-toast';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClub, setNewClub] = useState({ name: '', description: '', image: null });
  const { user } = useAuth();
  const isAdmin = user?.email === 'saurabhhembade9518@gmail.com';

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res = await getClubs();
      setClubs(res.data.clubs || []);
    } catch (error) {
      toast.error('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleCreateClub = async (e) => {
    e.preventDefault();
    if (!newClub.image) {
      return toast.error("Please select an image");
    }
    try {
      const formData = new FormData();
      formData.append('name', newClub.name);
      formData.append('description', newClub.description);
      formData.append('image', newClub.image);

      await createClub(formData);
      toast.success('Club created successfully');
      setIsModalOpen(false);
      setNewClub({ name: '', description: '', image: null });
      fetchClubs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create club');
    }
  };

  const handleDeleteClub = async (id) => {
    if(window.confirm('Are you sure you want to delete this club?')) {
      try {
        await deleteClub(id);
        toast.success('Club deleted');
        fetchClubs();
      } catch (error) {
        toast.error('Failed to delete club');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clubs Ecosystem</h1>
          <p className="text-gray-400">Discover and join amazing communities.</p>
        </div>
        {isAdmin && (
          <GradientButton onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={18} />
            <span>Create Club</span>
          </GradientButton>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : clubs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {clubs.map((club) => (
            <ClubCard key={club._id} club={club} onDelete={isAdmin ? handleDeleteClub : null} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={Users} 
          title="No Clubs Found" 
          description="There are no communities yet. Be the first to start a club!" 
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Club">
        <form onSubmit={handleCreateClub} className="space-y-5 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Club Name</label>
            <input
              type="text"
              value={newClub.name}
              onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              placeholder="e.g. CodeX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={newClub.description}
              onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
              required
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none"
              placeholder="What is this club about?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Club Image Logo</label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => setNewClub({ ...newClub, image: e.target.files[0] })}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>
          <GradientButton type="submit" className="w-full py-3">
            Confirm & Create
          </GradientButton>
        </form>
      </Modal>
    </div>
  );
};

export default Clubs;
