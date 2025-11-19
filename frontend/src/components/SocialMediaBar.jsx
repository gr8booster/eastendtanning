import { Facebook, Instagram } from 'lucide-react';

/**
 * Floating Social Media Bar - Sticky on desktop, hidden on mobile
 * Provides easy access to social media profiles
 */
export const SocialMediaBar = () => {
  return (
    <div 
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2 bg-white/80 backdrop-blur-sm p-3 rounded-l-xl shadow-lg border border-r-0"
      data-testid="social-media-bar"
    >
      <a 
        href="https://www.facebook.com/EastendTanningLaundry" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Follow us on Facebook"
        className="w-12 h-12 rounded-lg bg-[#1877F2] hover:bg-[#1877F2]/90 flex items-center justify-center transition-all hover:scale-110 shadow-md group relative"
        data-testid="floating-facebook"
      >
        <Facebook className="w-6 h-6 text-white" />
        <span className="absolute right-full mr-2 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Follow on Facebook
        </span>
      </a>
      
      <a 
        href="https://www.instagram.com/eastendmtvernon" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Follow us on Instagram"
        className="w-12 h-12 rounded-lg bg-gradient-to-tr from-[#FEDA75] via-[#FA7E1E] to-[#D62976] hover:opacity-90 flex items-center justify-center transition-all hover:scale-110 shadow-md group relative"
        data-testid="floating-instagram"
      >
        <Instagram className="w-6 h-6 text-white" />
        <span className="absolute right-full mr-2 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Follow on Instagram
        </span>
      </a>
      
      <a 
        href="https://www.tiktok.com/@peopleofeastend?_r=1&_t=ZT-91WGHnazFkr" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Follow us on TikTok"
        className="w-12 h-12 rounded-lg bg-black hover:bg-black/90 flex items-center justify-center transition-all hover:scale-110 shadow-md group relative"
        data-testid="floating-tiktok"
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
        <span className="absolute right-full mr-2 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Follow on TikTok
        </span>
      </a>
    </div>
  );
};

export default SocialMediaBar;
