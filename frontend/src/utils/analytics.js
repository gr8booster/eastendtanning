// Google Analytics 4 Integration

export const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return;
  
  // Check if GA is already loaded
  if (window.gtag) return;
  
  // Load GA script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);
  
  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    send_page_view: false // We'll manually send page views
  });
};

// Track page view
export const trackPageView = (url) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url
  });
};

// Track custom event
export const trackEvent = (action, category, label, value) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
};

// Track conversion event
export const trackConversion = (eventName, value, currency = 'USD') => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', eventName, {
    value: value,
    currency: currency
  });
};

// Track purchase
export const trackPurchase = (transactionId, value, items = []) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: 'USD',
    items: items
  });
};

// Track booking
export const trackBooking = (service, value) => {
  trackEvent('booking_completed', 'Engagement', service, value);
  trackConversion('booking', value);
};

// Track lead generation
export const trackLead = (source) => {
  trackEvent('generate_lead', 'Lead Generation', source);
};

// Track form submission
export const trackFormSubmit = (formName) => {
  trackEvent('form_submit', 'Engagement', formName);
};

// Track button click
export const trackButtonClick = (buttonName, location) => {
  trackEvent('button_click', 'Engagement', `${buttonName} - ${location}`);
};

// Track chat interaction
export const trackChatOpen = () => {
  trackEvent('chat_opened', 'Engagement', 'Mary Well Chat');
};

export const trackChatMessage = () => {
  trackEvent('chat_message_sent', 'Engagement', 'Mary Well Chat');
};

// Track discount usage
export const trackDiscountApplied = (percentage, code) => {
  trackEvent('discount_applied', 'Conversion', `${percentage}% - ${code}`);
};
