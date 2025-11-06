import { Card } from './ui/card';

export const StatCard = ({ title, value, change, icon: Icon, trend = 'up' }) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const trendBg = trend === 'up' ? 'bg-green-50' : trend === 'down' ? 'bg-red-50' : 'bg-gray-50';
  
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mb-2">{value}</h3>
          {change && (
            <span className={`text-sm font-medium ${trendColor}`}>
              {change}
            </span>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${trendBg}`}>
            <Icon className={`w-6 h-6 ${trendColor}`} />
          </div>
        )}
      </div>
    </Card>
  );
};