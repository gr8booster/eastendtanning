import { useState, useEffect } from 'react';
import { LeadCapturePopup } from './LeadCapturePopup';

export const LeadCaptureManager = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if popup has been shown in this session
    const popupShown = sessionStorage.getItem('lead_popup_shown');
    if (popupShown) {
      setHasShown(true);
      return;
    }

    // Generate session ID if not exists
    if (!sessionStorage.getItem('session_id')) {
      sessionStorage.setItem('session_id', `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }

    // Show popup after 30 seconds on site
    const timeoutId = setTimeout(() => {
      if (!hasShown) {
        setShowPopup(true);
        sessionStorage.setItem('lead_popup_shown', 'true');
        setHasShown(true);
      }
    }, 30000); // 30 seconds

    // Exit intent detection
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasShown) {
        setShowPopup(true);
        sessionStorage.setItem('lead_popup_shown', 'true');
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  // Track page views
  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const sessionId = sessionStorage.getItem('session_id');

    if (sessionId && backendUrl) {
      fetch(`${backendUrl}/api/analytics/pageview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_url: window.location.pathname,
          page_title: document.title,
          referrer: document.referrer || 'direct',
          user_agent: navigator.userAgent,
          session_id: sessionId
        })
      }).catch(err => console.error('Analytics error:', err));
    }
  }, []);

  return (
    <LeadCapturePopup
      isOpen={showPopup}
      onClose={() => setShowPopup(false)}
      source="exit_intent_popup"
    />
  );
};