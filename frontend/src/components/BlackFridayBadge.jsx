import { Badge } from './ui/badge';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BlackFridayBadge({ className = '', onClick }) {
  const navigate = useNavigate();
  
  // Expiration date: December 1st, 2025
  const EXPIRATION_DATE = new Date('2025-12-01T23:59:59');
  const now = new Date();
  
  // Don't show if expired
  if (now >= EXPIRATION_DATE) return null;
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/black-friday-checkout');
    }
  };
  
  return (
    <Badge 
      onClick={handleClick}
      className={`bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold animate-pulse hover:animate-none cursor-pointer hover:scale-105 transition-transform ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <Zap className="w-3 h-3 mr-1" />
      BLACK FRIDAY BOGO - Click Here!
    </Badge>
  );
}
