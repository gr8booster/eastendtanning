import { useState, useEffect } from 'react';
import { ShoppingCart, Check, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export function LotionsCatalog() {
  const [lotions, setLotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLotions();
  }, []);

  const fetchLotions = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/lotions`);
      if (response.ok) {
        const data = await response.json();
        setLotions(data);
      }
    } catch (error) {
      console.error('Failed to fetch lotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (lotion) => {
    toast.info(`To purchase ${lotion.name}, please call us at (740) 397-9632 or visit us at 818 Coshocton Ave, Mt Vernon! Our staff will help you choose the perfect lotion.`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-40 bg-muted rounded-lg mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (lotions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No lotions available at the moment. Check back soon!</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="lotions-catalog">
      {lotions.map((lotion) => (
        <Card key={lotion.id} className="overflow-hidden group hover:shadow-lg transition-shadow" data-testid="lotion-card">
          {lotion.image_url && (
            <div className="relative h-48 bg-gradient-to-br from-[#F59E0B]/10 to-[#14B8A6]/10 overflow-hidden">
              <img
                src={lotion.image_url}
                alt={lotion.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}

          <div className="p-5 space-y-3">
            <div>
              <h3 className="font-semibold text-lg">{lotion.name}</h3>
              {lotion.brand && <p className="text-sm text-muted-foreground">{lotion.brand}</p>}
            </div>

            {lotion.features && lotion.features.length > 0 && (
              <ul className="space-y-1">
                {lotion.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-[#14B8A6] mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {lotion.tattoo_guard && (
              <Badge variant="outline" className="w-full justify-center">
                <Sparkles className="w-3 h-3 mr-1" />
                Tattoo Guard
              </Badge>
            )}

            <Button
              onClick={() => handlePurchase(lotion)}
              className="w-full bg-gradient-to-r from-[#F59E0B] to-[#14B8A6]"
              data-testid="purchase-lotion-button"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy Now - Pickup at Eastend
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Pay online, pickup at 818 Coshocton Ave, Mt Vernon, OH
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
