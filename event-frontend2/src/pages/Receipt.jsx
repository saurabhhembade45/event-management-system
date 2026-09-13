import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, ArrowLeft, Calendar, MapPin, Ticket, User } from 'lucide-react';
import GradientButton from '../components/GradientButton';
import html2pdf from 'html2pdf.js';

const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, participant, paymentId } = location.state || {};

  if (!event || !participant) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h2 className="text-2xl font-bold mb-4">No Receipt Found</h2>
        <GradientButton onClick={() => navigate('/dashboard')}>Go to Dashboard</GradientButton>
      </div>
    );
  }

  const handlePrint = () => {
    const element = document.getElementById('pdf-receipt');
    const opt = {
      margin: 0.3,
      filename: `receipt_${paymentId || 'event'}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 3, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-6 flex">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
      </div>

      {/* VISIBLE DARK THEME RECEIPT (UI Only) */}
      <div className="glass-card overflow-hidden receipt-container">
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-b border-emerald-500/20 p-8 text-center">
          <div className="mx-auto bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-emerald-300">Thank you for your booking.</p>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Transaction ID</p>
              <p className="font-mono text-lg text-white">{paymentId || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Date Paid</p>
              <p className="text-lg text-white">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/5 p-6 rounded-xl border border-white/5">
              <h3 className="flex items-center text-xl font-semibold text-white mb-4">
                <Ticket className="mr-2 text-indigo-400" size={20} />
                Event Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Event Name</p>
                  <p className="text-lg font-medium text-white">{event.title}</p>
                </div>
                <div className="flex items-start">
                  <Calendar className="mr-3 text-pink-400 shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-400">Date & Time</p>
                    <p className="text-white">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="mr-3 text-purple-400 shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-xl border border-white/5">
              <h3 className="flex items-center text-xl font-semibold text-white mb-4">
                <User className="mr-2 text-indigo-400" size={20} />
                Participant Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-lg font-medium text-white">{participant.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{participant.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white">{participant.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-gray-900/50 p-6 rounded-xl border border-white/10">
            <span className="text-xl text-gray-300">Total Amount Paid</span>
            <span className="text-3xl font-bold text-white">
              {event.registrationFee && event.registrationFee > 0 ? `₹${event.registrationFee}` : 'Free'}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center px-8 py-3 border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors"
        >
          Go to Dashboard
        </button>
        <GradientButton onClick={handlePrint} className="flex items-center px-8 py-3">
          <Download size={20} className="mr-2" />
          Download Receipt
        </GradientButton>
      </div>

      {/* HIDDEN LIGHT THEME RECEIPT (Strictly for PDF Download) */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div id="pdf-receipt" className="bg-white w-[750px] text-gray-800 font-sans p-6 box-border border-2 border-gray-100 m-0">

          {/* Logo */}
          <div className="flex justify-center mb-3 border-b-4 border-indigo-600 pb-4">
            <img src="/dyp-logo.png" alt="DYP DPU Logo" className="h-16 object-contain" />
          </div>

          <h1 className="text-2xl font-extrabold text-center text-gray-900 mb-4 tracking-wide">
            OFFICIAL RECEIPT
          </h1>

          {/* Transaction & Date */}
          <div className="flex justify-between items-center mb-5 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-bold">Transaction ID</p>
              <p className="font-mono text-lg text-gray-900 font-bold">{paymentId || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-bold">Date Paid</p>
              <p className="text-lg text-gray-900 font-bold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Event & Participant Details */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
              <h3 className="text-base font-extrabold text-indigo-700 mb-3 pb-2 border-b border-gray-100 uppercase tracking-wide">
                Event Details
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Event Name</p>
                  <p className="text-sm font-bold text-gray-900">{event.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Date & Time</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
                  <p className="text-sm text-gray-900 font-medium">{event.location}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
              <h3 className="text-base font-extrabold text-indigo-700 mb-3 pb-2 border-b border-gray-100 uppercase tracking-wide">
                Participant Details
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Name</p>
                  <p className="text-sm font-bold text-gray-900">{participant.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                  <p className="text-sm text-gray-900 font-medium">{participant.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
                  <p className="text-sm text-gray-900 font-medium">{participant.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 mb-5">
            <span className="text-base text-gray-600 font-bold uppercase tracking-widest">Total Amount Paid</span>
            <span className="text-2xl font-black text-indigo-700">
              {event.registrationFee && event.registrationFee > 0 ? `₹${event.registrationFee}` : 'Free'}
            </span>
          </div>

          {/* Signature */}
          <div className="flex justify-end pt-2">
            <div className="text-center w-40">
              <img
                src="/signature-final.jpeg"
                alt="Signature"
                className="h-16 w-full object-contain mx-auto mix-blend-multiply mb-1"
              />
              <div className="border-t-2 border-gray-800 pt-1">
                <p className="text-sm font-bold text-gray-900">Authorized Signatory</p>
                <p className="text-xs text-gray-600">Eventopia Administration</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Receipt;