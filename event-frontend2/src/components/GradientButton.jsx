import { motion } from 'framer-motion';

const GradientButton = ({ children, onClick, className = '', type = 'button', disabled = false }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`gradient-bg px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-indigo-500/50 transition-shadow disabled:opacity-50 ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default GradientButton;
