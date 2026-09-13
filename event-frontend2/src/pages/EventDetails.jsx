import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar as CalendarIcon, Users, Clock, ArrowLeft } from 'lucide-react';
import { getSingleEvent, deleteEvent } from '../api/events';
import { checkParticipation } from '../api/participants';
import { createOrder, verifyPayment } from '../api/payments';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import GradientButton from '../components/GradientButton';
import { toast } from 'react-hot-toast';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    year: '',
    emergencyContact: '',
    requirements: ''
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      setPaymentForm(prev => ({
        ...prev,
        name: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const [eventRes, partRes] = await Promise.all([
          getSingleEvent(id),
          checkParticipation(id).catch(() => ({ data: { participated: false } }))
        ]);
        setEvent(eventRes.data.event);
        setIsBooked(partRes.data.participated);
      } catch (error) {
        toast.error('Failed to load event details');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleDelete = async () => {
    if(window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        toast.success('Event deleted');
        navigate('/events');
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleBooking = () => {
    setShowPaymentModal(true);
  };

  const handleFormChange = (e) => {
    setPaymentForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

  const processPayment = async (e) => {
    e.preventDefault();
    if (!paymentForm.name || !paymentForm.email || !paymentForm.phone) {
      return toast.error("Please fill required fields (Name, Email, Phone)");
    }

    setProcessing(true);

    try {
      // Ensure Razorpay SDK is loaded on mobile/web
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setProcessing(false);
        return toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
      }

      // Step 1: Create Order
      const orderRes = await createOrder({ eventId: id });
      
      if (!orderRes.data.success || !orderRes.data.order) {
        throw new Error("Order creation failed");
      }

      const orderData = orderRes.data.order;

      // Hide the details modal before launching Razorpay to prevent GPU/backdrop conflicts on mobile
      setShowPaymentModal(false);

      const options = {
        key: "rzp_test_RL6e1Ke8DvBIBO",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Eventopia",
        description: `Booking for ${event.title}`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              eventId: id,
              ...paymentForm
            });
            
            if (verifyRes.data.success) {
              toast.success("Payment successful!");
              navigate('/receipt', { 
                state: { 
                  event, 
                  participant: verifyRes.data.participant,
                  paymentId: response.razorpay_payment_id 
                }
              });
            } else {
              toast.error(verifyRes.data.message || "Payment verification failed");
              setShowPaymentModal(true);
            }
          } catch (err) {
            toast.error("Payment verification failed");
            setShowPaymentModal(true);
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            setShowPaymentModal(true);
          }
        },
        prefill: {
          name: paymentForm.name,
          email: paymentForm.email,
          contact: paymentForm.phone
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        toast.error("Payment Failed: " + (response.error?.description || ""));
        setProcessing(false);
        setShowPaymentModal(true);
      });
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong during payment initialization");
      setProcessing(false);
    }
  };

  if (loading) return <Loader />;
  if (!event) return null;

  const isAdmin = user?.email === 'saurabhhembade9518@gmail.com';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Events
      </button>

      <div className="glass-card overflow-hidden">
        <div className="h-48 sm:h-72 md:h-96 relative bg-gray-800">
          {event.image ? (
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-premium opacity-50 flex items-center justify-center">
              <CalendarIcon size={64} className="text-white/50" />
            </div>
          )}
        </div>
        
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-4 text-gray-300">
                <div className="flex items-center bg-white/5 px-4 py-2 rounded-lg">
                  <CalendarIcon size={18} className="text-indigo-400 mr-2" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center bg-white/5 px-4 py-2 rounded-lg">
                  <Clock size={18} className="text-pink-400 mr-2" />
                  {event.time}
                </div>
                <div className="flex items-center bg-white/5 px-4 py-2 rounded-lg">
                  <MapPin size={18} className="text-purple-400 mr-2" />
                  {event.location}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="text-2xl font-bold text-white text-center mb-2">
                {event.registrationFee && event.registrationFee > 0 ? `₹${event.registrationFee}` : 'Free'}
              </div>
              <GradientButton 
                onClick={handleBooking} 
                className="w-full py-3 text-lg"
                disabled={isBooked}
              >
                {isBooked ? 'Already Booked' : 'Book Ticket'}
              </GradientButton>
              
              {isAdmin ? (
                <button onClick={handleDelete} className="text-red-400 text-sm hover:underline mt-2 text-center">
                  Delete Event
                </button>
              ) : null}
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">About this Event</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Participant Details</h2>
              <p className="text-gray-400 mb-6">Please fill in your details for {event.title}</p>
              
              <form onSubmit={processPayment} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={paymentForm.name} 
                      onChange={handleFormChange} required 
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={paymentForm.email} 
                      onChange={handleFormChange} required 
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={paymentForm.phone} 
                      onChange={handleFormChange} required 
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">College (Optional)</label>
                    <input 
                      type="text" 
                      name="college" 
                      value={paymentForm.college} 
                      onChange={handleFormChange} 
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
                    <select 
                      name="year" 
                      value={paymentForm.year} 
                      onChange={handleFormChange} 
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">Select Year (Optional)</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Emergency Contact (Optional)</label>
                    <input 
                      type="tel" 
                      name="emergencyContact" 
                      value={paymentForm.emergencyContact} 
                      onChange={handleFormChange} 
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Special Requirements</label>
                    <textarea 
                      name="requirements" 
                      value={paymentForm.requirements} 
                      onChange={handleFormChange} rows={2} 
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowPaymentModal(false)} 
                    className="flex-1 px-4 py-3 border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <GradientButton 
                    type="submit" 
                    disabled={processing}
                    className="flex-1 py-3"
                  >
                    {processing ? 'Processing...' : 'Proceed to Payment'}
                  </GradientButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
