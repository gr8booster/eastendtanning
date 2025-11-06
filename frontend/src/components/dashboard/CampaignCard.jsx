import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TrendingUp, Eye, MousePointerClick, DollarSign } from 'lucide-react';

export const CampaignCard = ({ campaign }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-800',
    draft: 'bg-blue-100 text-blue-800'
  };

  const typeIcons = {
    email: '📧',
    sms: '💬',
    social: '📱',
    google_update: '🔍',
    seo: '🎯'
  };

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{typeIcons[campaign.type] || '📢'}</span>
          <div>
            <h4 className="font-semibold text-base">{campaign.name}</h4>
            <p className="text-xs text-muted-foreground capitalize">{campaign.type.replace('_', ' ')}</p>
          </div>
        </div>
        <Badge className={statusColors[campaign.status]}>
          {campaign.status}
        </Badge>
      </div>
      
      {campaign.metrics && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Impressions</p>
              <p className="font-semibold text-sm">{campaign.metrics.impressions?.toLocaleString() || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Clicks</p>
              <p className="font-semibold text-sm">{campaign.metrics.clicks?.toLocaleString() || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Conversions</p>
              <p className="font-semibold text-sm">{campaign.metrics.conversions || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">ROI</p>
              <p className="font-semibold text-sm">{campaign.metrics.roi?.toFixed(1) || 0}x</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};