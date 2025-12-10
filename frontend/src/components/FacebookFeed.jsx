import { useEffect } from 'react';
import { Card } from './ui/card';

export const FacebookFeed = ({ pageUrl, pageName }) => {
  useEffect(() => {
    // Load Facebook SDK
    if (window.FB) {
      window.FB.XFBML.parse();
    } else {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <Card className="p-6 bg-white shadow-lg">
      <h3 className="font-bold text-xl mb-4 text-center">Latest from {pageName}</h3>
      <div 
        className="fb-page" 
        data-href={pageUrl}
        data-tabs="timeline"
        data-width="500"
        data-height="600"
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      >
        <blockquote cite={pageUrl} className="fb-xfbml-parse-ignore">
          <a href={pageUrl}>Visit {pageName} on Facebook</a>
        </blockquote>
      </div>
      
      {/* Fallback for crawlers */}
      <noscript>
        <p><a href={pageUrl} target="_blank" rel="noopener noreferrer">Follow {pageName} on Facebook</a> for latest updates, photos, and special offers.</p>
      </noscript>
    </Card>
  );
};
