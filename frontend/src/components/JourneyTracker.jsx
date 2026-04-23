import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function getUUID() {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function JourneyTracker() {
  const location = useLocation();

  useEffect(() => {
    // Get or create session ID
    let sessionId = localStorage.getItem('marketing_session_id');
    if (!sessionId) {
      sessionId = getUUID();
      localStorage.setItem('marketing_session_id', sessionId);
    }

    // Track visit
    const trackVisit = async () => {
      try {
        await fetch('/api/journey/visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: sessionId,
            page_url: location.pathname,
            referrer: document.referrer || 'direct',
          }),
        });
      } catch (error) {
        console.error('Failed to track journey visit:', error);
      }
    };

    trackVisit();
  }, [location.pathname]);

  return null;
}