import { useEffect, useRef } from 'react';
import { APPROVAL_PENDING, resolveProvider } from '../../lib/adsConfig';

export default function AdSlot({ id, position, variant = 'default', pageType = 'general' }) {
  const adRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (APPROVAL_PENDING) {
      return;
    }

    const provider = resolveProvider(pageType, position);
    if (!provider || initialized.current) {
      return;
    }

    const loadAd = async () => {
      try {
        if (provider === 'adsense') {
          await loadAdSenseAd();
        } else if (provider === 'medianet') {
          await loadMediaNetAd();
        } else if (provider === 'propeller') {
          await loadPropellerAd();
        }
        initialized.current = true;
      } catch (error) {
        console.error('Failed to load ad:', error);
      }
    };

    loadAd();
  }, [id, position, pageType]);

  const loadAdSenseAd = async () => {
    if (!window.adsbygoogle) {
      return;
    }

    const adElement = adRef.current;
    if (!adElement) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  };

  const loadMediaNetAd = async () => {
    // Media.net implementation
    if (!window._mNHandle) {
      // Load Media.net script if not already loaded
      const script = document.createElement('script');
      script.src = 'https://contextual.media.net/dmedianet.js';
      script.async = true;
      document.head.appendChild(script);
    }
    // Media.net ad initialization would go here
  };

  const loadPropellerAd = async () => {
    // Propeller Ads implementation
    // Propeller ad initialization would go here
  };

  // Don't render if approval is pending
  if (APPROVAL_PENDING) {
    return null;
  }

  const getAdDimensions = () => {
    switch (position) {
      case 'top':
      case 'bottom':
        return { width: '728', height: '90' };
      case 'inline':
        return { width: '970', height: '250' };
      case 'sidebar':
        return { width: '300', height: '250' };
      default:
        return { width: '728', height: '90' };
    }
  };

  const dimensions = getAdDimensions();
  const provider = resolveProvider('general', position);

  if (!provider) {
    return null;
  }

  return (
    <div className="ad-slot-container my-8" data-ad-position={position}>
      <div className="text-center text-xs text-slate-500 mb-2">Advertisement</div>
      <div 
        className="mx-auto flex items-center justify-center"
        style={{ 
          maxWidth: `${dimensions.width}px`,
          minHeight: `${dimensions.height}px`
        }}
      >
        {provider === 'adsense' && (
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{
              display: 'inline-block',
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`
            }}
            data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT}
            data-ad-slot={import.meta.env[`VITE_ADSENSE_SLOT_${position.toUpperCase()}`]}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
        
        {provider === 'medianet' && (
          <div
            ref={adRef}
            id={`media-net-${id}`}
            className="media-net-ad"
            style={{
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`
            }}
          />
        )}
        
        {provider === 'propeller' && (
          <div
            ref={adRef}
            id={`propeller-${id}`}
            className="propeller-ad"
            style={{
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`
            }}
          />
        )}
        
        {/* Fallback for when no ads load */}
        {!provider && (
          <div 
            className="glassmorphism-dark rounded-xl flex items-center justify-center text-slate-500 text-sm"
            style={{
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`
            }}
          >
            <div className="text-center">
              <i className="fas fa-ad text-2xl mb-2"></i>
              <div>Advertisement Space</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
