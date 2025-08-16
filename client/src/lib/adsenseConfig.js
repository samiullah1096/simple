// Google AdSense Configuration for ToolsUniverse
// Enhanced for high-quality content and optimal ad placement

export const ADSENSE_CONFIG = {
  // Google AdSense Publisher ID
  publisherId: 'ca-pub-8235343370386318',
  
  // Ad Unit Configuration
  adUnits: {
    // Homepage ads
    homeBanner: {
      id: '1234567890',
      format: 'auto',
      responsive: true,
      style: {
        display: 'block',
        width: '100%',
        height: '250px'
      }
    },
    
    // Tool page ads
    toolSidebar: {
      id: '2345678901',
      format: 'auto',
      responsive: true,
      style: {
        display: 'block',
        width: '300px',
        height: '250px'
      }
    },
    
    // Category page ads
    categoryBanner: {
      id: '3456789012',
      format: 'auto',
      responsive: true,
      style: {
        display: 'block',
        width: '100%',
        height: '200px'
      }
    },
    
    // In-content ads
    inContent: {
      id: '4567890123',
      format: 'fluid',
      responsive: true,
      style: {
        display: 'block'
      }
    }
  },
  
  // Ad placement rules for optimal UX
  placement: {
    // Minimum content before first ad
    minContentHeight: 300,
    
    // Maximum ads per page
    maxAdsPerPage: 3,
    
    // Minimum spacing between ads
    minAdSpacing: 400,
    
    // Ad density limit (ads/1000 words)
    maxAdDensity: 2
  },
  
  // Content guidelines for AdSense approval
  contentGuidelines: {
    // Original, high-quality content
    originalContent: true,
    
    // Professional design and navigation
    professionalDesign: true,
    
    // Clear privacy policy and terms
    legalPages: true,
    
    // Family-friendly content
    familyFriendly: true,
    
    // No prohibited content
    noProhibitedContent: true
  },
  
  // AdSense policy compliance
  policyCompliance: {
    // No click encouragement
    noClickEncouragement: true,
    
    // Clear ad labeling
    clearAdLabeling: true,
    
    // No deceptive practices
    noDeceptivePractices: true,
    
    // Respect user experience
    respectUserExperience: true
  }
};

// AdSense script loading configuration
export const ADSENSE_SCRIPT_CONFIG = {
  src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.publisherId}`,
  crossOrigin: 'anonymous',
  async: true,
  defer: true
};

// Auto ads configuration
export const AUTO_ADS_CONFIG = {
  enable: true,
  publisherId: ADSENSE_CONFIG.publisherId,
  // Auto ads will automatically place ads in optimal positions
  autoPlacement: {
    anchor: true,
    multiplex: true,
    inArticle: true,
    inFeed: false // Disabled for tool-based content
  }
};

export default ADSENSE_CONFIG;