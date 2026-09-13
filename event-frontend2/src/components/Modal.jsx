import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 9998,
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transformTemplate={({ scale, y }) =>
              `translate(-50%, -50%) scale(${scale}) translateY(${y})`
            }
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              width: '90%',
              maxWidth: '520px',
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '90vh',
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 sm:px-6 sm:py-5 border-b border-white/[0.06] shrink-0">
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  style={{
                    padding: '6px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;