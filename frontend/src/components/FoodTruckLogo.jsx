export const FoodTruckLogo = ({ className = "w-32 h-32", showText = true }) => {
  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      {/* Logo SVG */}
      <svg 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background Circle */}
        <circle cx="100" cy="100" r="95" fill="#FF6600" opacity="0.1"/>
        
        {/* Main Truck Body */}
        <rect x="40" y="70" width="90" height="50" rx="5" fill="#FF6600"/>
        
        {/* Truck Cab */}
        <rect x="130" y="85" width="30" height="35" rx="3" fill="#FF6600"/>
        
        {/* Serving Window */}
        <rect x="55" y="82" width="35" height="25" rx="2" fill="#FFF" opacity="0.9"/>
        <rect x="95" y="82" width="25" height="25" rx="2" fill="#FFF" opacity="0.9"/>
        
        {/* Windshield */}
        <rect x="135" y="90" width="20" height="15" rx="2" fill="#87CEEB" opacity="0.7"/>
        
        {/* Awning */}
        <path d="M 35 70 L 40 65 L 130 65 L 135 70 Z" fill="#FFB366"/>
        
        {/* Wheels */}
        <circle cx="65" cy="125" r="12" fill="#333"/>
        <circle cx="65" cy="125" r="6" fill="#666"/>
        <circle cx="145" cy="125" r="12" fill="#333"/>
        <circle cx="145" cy="125" r="6" fill="#666"/>
        
        {/* Decorative Lines */}
        <line x1="50" y1="95" x2="115" y2="95" stroke="#FFB366" strokeWidth="2"/>
        <line x1="50" y1="102" x2="115" y2="102" stroke="#FFB366" strokeWidth="2"/>
        
        {/* 818 Number on side */}
        <text x="75" y="115" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#FFF">818</text>
      </svg>
      
      {/* Logo Text */}
      {showText && (
        <div className="text-center">
          <div className="font-serif text-xl font-bold text-[hsl(24_100%_40%)] leading-tight">818</div>
          <div className="font-serif text-lg font-semibold text-[hsl(24_100%_50%)]">Food Truck Stop</div>
        </div>
      )}
    </div>
  );
};
