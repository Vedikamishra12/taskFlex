import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", hover = false, ...props }) => (
  <motion.div
    initial={false}
    whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
    className={`rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-5 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

export default GlassCard;
