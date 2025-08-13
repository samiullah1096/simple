// Ad configuration based on environment variables
export const APPROVAL_PENDING = import.meta.env.VITE_APPROVAL_PENDING === 'true';

export const PROVIDERS = {
  adsense: import.meta.env.VITE_ADSENSE_ENABLED === 'true',
  medianet: import.meta.env.VITE_MEDIANET_ENABLED === 'true',
  propeller: import.meta.env.VITE_PROPELLER_ENABLED === 'true',
};

// Ad density limits
export const LIMITS = {
  generalPage: 3, // Home, category pages
  toolPage: 2,    // Individual tool pages
};

// Provider priority and routing
export function resolveProvider(pageType, position) {
  if (APPROVAL_PENDING) {
    return null;
  }

  // Priority order: AdSense -> Media.net -> Propeller
  if (PROVIDERS.adsense) return 'adsense';
  if (PROVIDERS.medianet) return 'medianet';
  if (PROVIDERS.propeller) return 'propeller';
  
  return null;
}

// Ad slot configuration for different page types
export const AD_SLOTS = {
  home: {
    top: { id: 'home-top', position: 'top' },
    mid: { id: 'home-mid', position: 'inline' },
    bottom: { id: 'home-bottom', position: 'bottom' }
  },
  category: {
    top: { id: 'category-top', position: 'top' },
    mid: { id: 'category-mid', position: 'inline' },
    bottom: { id: 'category-bottom', position: 'bottom' }
  },
  tool: {
    top: { id: 'tool-top', position: 'top' },
    bottom: { id: 'tool-bottom', position: 'bottom' }
  }
};

// Validate ad density for a page
export function validateAdDensity(pageType, adCount) {
  const limit = LIMITS[pageType] || LIMITS.generalPage;
  return adCount <= limit;
}

// Check if ads should be shown
export function shouldShowAds() {
  return !APPROVAL_PENDING && Object.values(PROVIDERS).some(enabled => enabled);
}
