import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ADSENSE_CONFIG } from '../../lib/adsenseConfig';

const EnhancedAdSlot = ({ 
  adSlot = 'homeBanner', 
  className = '',
  fadeIn = true,
  respectUX = true 
}) => {
  const adRef = useRef(null);
  const adConfig = ADSENSE_CONFIG.adUnits[adSlot];

  useEffect(() => {
    // Only load ads if AdSense is properly configured and approved
    if (window.adsbygoogle && adConfig) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.log('AdSense not ready:', e);
      }
    }
  }, [adConfig]);

  if (!adConfig) {
    return null; // Don't render if ad unit is not configured
  }

  const AdComponent = (
    <div className={`ad-container ${respectUX ? 'respect-ux' : ''} ${className}`}>
      {/* Ad label for transparency */}
      <div className="text-xs text-slate-500 mb-1 text-center">Advertisement</div>
      
      <ins
        className="adsbygoogle"
        style={adConfig.style}
        data-ad-client={ADSENSE_CONFIG.publisherId}
        data-ad-slot={adConfig.id}
        data-ad-format={adConfig.format}
        data-full-width-responsive={adConfig.responsive}
        ref={adRef}
      />
    </div>
  );

  return fadeIn ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="ad-wrapper"
    >
      {AdComponent}
    </motion.div>
  ) : (
    AdComponent
  );
};

export default EnhancedAdSlot;