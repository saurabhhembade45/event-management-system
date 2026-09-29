import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import GradientButton from '../components/GradientButton';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(60); // 60 seconds resend cooldown
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Handle countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle digit input change & auto advance
  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only keep last digit entered
    setOtp(newOtp);

    // Auto advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle pasting 6-digit code
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  // Submit OTP Verification
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) return;

    setSubmitting(true);
    const success = await verifyOtp({ email, otp: fullOtp });
    setSubmitting(false);
  };

  // Resend OTP
  const handleResend = async () => {
    if (!canResend || !email) return;

    const res = await resendOtp({ email });
    if (res?.success) {
      setCooldown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } else if (res?.retryAfterSeconds) {
      setCooldown(res.retryAfterSeconds);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070')] bg-cover bg-center opacity-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 relative z-10 text-center"
      >
        <div className="mb-6">
          <div className="w-16 h-16 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Verify Your Email</h1>
          <p className="text-gray-400 text-sm">
            We sent a 6-digit verification code to
          </p>
          <p className="text-indigo-300 font-semibold mt-1 text-sm">{email || 'your email address'}</p>
        </div>

        {!email && (
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* OTP Digit Inputs */}
          <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 bg-white/5 border border-white/15 rounded-xl text-center text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            ))}
          </div>

          <p className="text-xs text-gray-400 mb-6">
            Code expires in 5 minutes
          </p>

          <GradientButton
            onClick={handleSubmit}
            disabled={submitting || otp.join('').length !== 6}
            className="w-full py-3 mb-4 disabled:opacity-50"
          >
            {submitting ? 'Verifying...' : 'Verify OTP'}
          </GradientButton>
        </form>

        <div className="flex items-center justify-between text-sm mt-4">
          <span className="text-gray-400">Didn't receive code?</span>
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`font-medium transition-colors ${
              canResend
                ? 'text-indigo-400 hover:text-indigo-300 cursor-pointer'
                : 'text-gray-500 cursor-not-allowed'
            }`}
          >
            {canResend ? 'Resend OTP' : `Resend in ${cooldown}s`}
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          Back to{' '}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default OTPVerification;
