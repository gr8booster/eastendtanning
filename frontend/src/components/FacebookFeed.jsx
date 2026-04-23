import { Card } from './ui/card';

export const FacebookFeed = ({ pageUrl, pageName }) => {
  // Use the standard business URL for embedding if possible, or fallback to the provided pageUrl
  const embedUrl = "https://www.facebook.com/EastendTanningLaundry";
  
  return (
    <Card className="p-6 bg-white shadow-lg w-full max-w-xl mx-auto overflow-hidden">
      <h3 className="font-bold text-xl mb-4 text-center">Latest from {pageName}</h3>
      
      <div className="flex justify-center">
        {/* Facebook Page Plugin Iframe */}
        <div className="border rounded-lg overflow-hidden bg-gray-50" style={{ width: '100%', maxWidth: '500px' }}>
          <iframe 
            src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(embedUrl)}&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`} 
            width="500" 
            height="500" 
            style={{ border: 'none', overflow: 'hidden', width: '100%' }} 
            scrolling="no" 
            frameBorder="0" 
            allowFullScreen={true} 
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title="Facebook Feed"
          ></iframe>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <a 
          href={embedUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#1877F2] font-semibold hover:underline"
        >
          View Page on Facebook
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </Card>
  );
};