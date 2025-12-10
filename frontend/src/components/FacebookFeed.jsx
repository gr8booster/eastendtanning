import { useEffect } from 'react';
import { Card } from './ui/card';

export const FacebookFeed = ({ pageUrl, pageName }) => {
  useEffect(() => {
    // Load Facebook SDK
    if (window.FB) {
      window.FB.XFBML.parse();
    } else {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0&appId=YOUR_APP_ID';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <Card className="p-6 bg-white shadow-lg max-w-xl mx-auto">
      <h3 className="font-bold text-xl mb-4 text-center">Latest from {pageName}</h3>
      
      {/* Direct link to Facebook page with prominent button */}
      <div className="text-center space-y-4">
        <p className="text-muted-foreground mb-4">
          Follow us on Facebook for the latest updates, photos, and special offers!
        </p>
        <a 
          href={pageUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white rounded-lg font-semibold hover:bg-[#166FE5] transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Follow {pageName} on Facebook
        </a>
        
        {/* Embedded timeline posts */}
        <div className="mt-6 border rounded-lg p-4 bg-gray-50">
          <p className="text-sm text-muted-foreground italic">
            📱 Visit our Facebook page to see our latest posts, photos, and customer stories!
          </p>
        </div>
      </div>
      
      {/* Fallback for crawlers */}
      <noscript>
        <p><a href={pageUrl} target="_blank" rel="noopener noreferrer">Follow {pageName} on Facebook</a> for latest updates, photos, and special offers.</p>
      </noscript>
    </Card>
  );
};
