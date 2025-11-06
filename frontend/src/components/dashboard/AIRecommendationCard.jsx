import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AlertCircle, TrendingUp, Lightbulb, Target } from 'lucide-react';

export const AIRecommendationCard = ({ recommendation, onImplement, onReject }) => {
  const priorityConfig = {
    urgent: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
    high: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: TrendingUp },
    medium: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Lightbulb },
    low: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Target }
  };

  const config = priorityConfig[recommendation.priority] || priorityConfig.medium;
  const Icon = config.icon;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    implemented: 'bg-green-100 text-green-800',
    rejected: 'bg-gray-100 text-gray-800'
  };

  return (
    <Card className={`p-5 border-l-4 ${config.color.split(' ')[2]}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.color.split(' ')[0]}`}>
          <Icon className={`w-5 h-5 ${config.color.split(' ')[1]}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-base mb-1">{recommendation.title}</h4>
              <div className="flex gap-2 mb-2">
                <Badge className={config.color}>
                  {recommendation.priority}
                </Badge>
                <Badge className={statusColors[recommendation.status]}>
                  {recommendation.status.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  🤖 {recommendation.ai_model}
                </Badge>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">{recommendation.description}</p>
          
          <div className="bg-muted/50 p-3 rounded-lg mb-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Suggested Action:</p>
            <p className="text-sm">{recommendation.suggested_action}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Est. Impact: </span>
              <span className="font-semibold text-secondary">{recommendation.estimated_impact}</span>
            </div>
            
            {recommendation.status === 'pending' && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => onImplement?.(recommendation.id)}
                  className="bg-secondary text-white"
                >
                  Implement
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onReject?.(recommendation.id)}
                >
                  Dismiss
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};