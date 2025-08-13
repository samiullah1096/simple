import { useEffect } from 'react';

export default function AutoAdsScript() {
  useEffect(() => {
    const enabled = import.meta.env.VITE_ADSENSE_ENABLED === 'true';
    const pending = import.meta.env.VITE_APPROVAL_PENDING === 'true';
    const client = import.meta.env.VITE_ADSENSE_CLIENT || '';

    if (!enabled || pending || !client) {
      return;
    }

    // Load AdSense script
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    
    script.onload = () => {
      console.log('AdSense Auto Ads loaded');
    };

    script.onerror = () => {
      console.error('Failed to load AdSense Auto Ads');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
}
