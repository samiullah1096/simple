import { Link } from 'wouter';
import { motion } from 'framer-motion';

export default function ToolCard({ tool, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="tool-card glassmorphism rounded-2xl p-6 cursor-pointer group"
    >
      <Link href={tool.path}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${tool.color.replace('text-', 'from-').replace('-400', '-500')} to-${tool.color.split('-')[1]}-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <i className={`${tool.icon} text-white text-xl`}></i>
          </div>
          {tool.featured && (
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">
              Popular
            </span>
          )}
        </div>
        
        <h3 className="font-semibold mb-2 text-slate-100 group-hover:text-cyan-400 transition-colors duration-300">
          {tool.name}
        </h3>
        
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
          {tool.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">{tool.category}</span>
          <i className="fas fa-arrow-right text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300"></i>
        </div>
      </Link>
    </motion.div>
  );
}
