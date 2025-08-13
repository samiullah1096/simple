import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    // Initialize analytics and ad scripts here
    console.log('Cookies accepted - Initialize tracking');
    closeBanner();
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    console.log('Cookies declined - Disable tracking');
    closeBanner();
  };

  const closeBanner = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md glassmorphism-dark rounded-2xl p-6 z-50 transition-all duration-300 ${
        isClosing ? 'transform translate-y-full opacity-0' : 'animate-slide-up'
      }`}
      role="banner"
      aria-label="Cookie consent"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <i className="fas fa-cookie-bite text-yellow-400 text-2xl"></i>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Cookie Consent</h3>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            We use cookies to enhance your experience and show relevant ads. By continuing, you agree to our 
            <Link href="/legal/privacy" className="text-cyan-400 hover:text-cyan-300 ml-1">
              Privacy Policy
            </Link>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAccept}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500/50"
            >
              Essential Only
            </button>
          </div>
        </div>
        <button
          onClick={closeBanner}
          className="flex-shrink-0 text-slate-400 hover:text-white transition-colors p-1"
          aria-label="Close banner"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
}
