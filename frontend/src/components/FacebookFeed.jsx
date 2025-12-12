import { useEffect } from 'react';
import { Card } from './ui/card';

export const FacebookFeed = ({ pageUrl, pageName }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="p-6 bg-white shadow-lg max-w-xl mx-auto">
        <h3 className="font-bold text-xl mb-4 text-center">Latest from {pageName}</h3>
        
        {/* Direct link to Facebook page with prominent button */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground mb-4">
            Follow us on Facebook for the latest updates, photos, and special offers!
          </p>
          <div className="flex gap-3 justify-center">
            <a 
              href={pageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white rounded-lg font-semibold hover:bg-[#166FE5] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Follow on Facebook
            </a>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Quick View
            </button>
          </div>
          
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

      {/* Facebook Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-[#1877F2] text-white">
              <h3 className="font-bold text-lg">{pageName} - Facebook</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <iframe
              src={pageUrl}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              title={`${pageName} Facebook Page`}
            />
            <div className="absolute bottom-4 right-4">
              <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg font-semibold hover:bg-[#166FE5] transition-colors shadow-lg"
              >
                Open in New Tab
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
