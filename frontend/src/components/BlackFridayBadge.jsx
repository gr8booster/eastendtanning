import { Badge } from './ui/badge';
import { Zap } from 'lucide-react';

export function BlackFridayBadge({ className = '' }) {
  // Expiration date: December 1st, 2024
  const EXPIRATION_DATE = new Date('2024-12-01T23:59:59');
  const now = new Date();
  
  // Don't show if expired
  if (now >= EXPIRATION_DATE) return null;
  
  return (
    <Badge 
      className={`bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold animate-pulse hover:animate-none ${className}`}
    >
      <Zap className="w-3 h-3 mr-1" />
      BLACK FRIDAY BOGO
    </Badge>
  );
}
