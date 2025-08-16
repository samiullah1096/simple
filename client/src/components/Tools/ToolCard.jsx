import { Link } from 'wouter';
import { motion } from 'framer-motion';

export default function ToolCard({ tool, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -12, 
        scale: 1.03,
        transition: { duration: 0.4 }
      }}
      whileTap={{ scale: 0.98 }}
      className="tool-card glassmorphism rounded-2xl p-6 cursor-pointer group animated-button interactive-hover"
      data-testid={`tool-card-${tool.slug}`}
    >
      <Link href={tool.path}>
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            className={`w-12 h-12 bg-gradient-to-br ${tool.color.replace('text-', 'from-').replace('-400', '-500')} to-${tool.color.split('-')[1]}-600 rounded-xl flex items-center justify-center pulse-glow`}
            whileHover={{ 
              scale: 1.2, 
              rotate: 12,
              transition: { duration: 0.3 }
            }}
          >
            <motion.i 
              className={`${tool.icon} text-white text-xl`}
              whileHover={{ scale: 1.1 }}
            />
          </motion.div>
          {tool.featured && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full shimmer float"
            >
              Popular
            </motion.span>
          )}
        </div>
        
        <motion.h3 
          className="font-semibold mb-2 text-slate-100 group-hover:text-cyan-400 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
        >
          {tool.name}
        </motion.h3>
        
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
          {tool.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 capitalize">{tool.category}</span>
          <motion.i 
            className="fas fa-arrow-right text-slate-400 group-hover:text-cyan-400 transition-colors duration-300"
            whileHover={{ 
              x: 4,
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
