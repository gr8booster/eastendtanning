import { useState, useEffect } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { CampaignCard } from '../components/dashboard/CampaignCard';
import { AIRecommendationCard } from '../components/dashboard/AIRecommendationCard';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Users, Eye, TrendingUp, DollarSign, 
  Target, Zap, Calendar, Award,
  RefreshCw, Download, Settings, Sparkles, Brain, Rocket
} from 'lucide-react';
import { toast } from 'sonner';

export default function Admin() {
  const [metrics, setMetrics] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard metrics
      const metricsRes = await fetch(`${backendUrl}/api/dashboard/metrics`);
      const metricsData = await metricsRes.json();
      setMetrics(metricsData);

      // Fetch campaigns
      const campaignsRes = await fetch(`${backendUrl}/api/campaigns?status=active`);
      const campaignsData = await campaignsRes.json();
      setCampaigns(campaignsData);

      // Fetch AI recommendations
      const recsRes = await fetch(`${backendUrl}/api/ai/recommendations?status=pending`);
      const recsData = await recsRes.json();
      setRecommendations(recsData);

      // Fetch recent leads
      const leadsRes = await fetch(`${backendUrl}/api/leads?limit=10`);
      const leadsData = await leadsRes.json();
      setLeads(leadsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImplementRecommendation = async (id) => {
    try {
      await fetch(`${backendUrl}/api/ai/recommendations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_progress' })
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error implementing recommendation:', error);
    }
  };

  const handleRejectRecommendation = async (id) => {
    try {
      await fetch(`${backendUrl}/api/ai/recommendations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting recommendation:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-secondary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Command Center...</p>
        </div>
      </div>
    );
  }

  const monthlyGoal = 83333.33; // $1M / 12 months
  const currentRevenue = metrics?.total_revenue || 0;
  const revenueProgress = (currentRevenue / monthlyGoal * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(42_92%_55%)] to-[hsl(183_55%_43%)] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1400px] py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">
                🎯 Eastend Command Center
              </h1>
              <p className="text-white/90">AI-Powered Marketing & Orchestration Dashboard</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={fetchDashboardData}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1400px] py-8">
        {/* Revenue Goal Progress */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-white to-[hsl(43_96%_98%)] border-2 border-[hsl(var(--primary))]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-1">Monthly Revenue Goal</h3>
              <p className="text-muted-foreground">Target: $83,333.33 → $1M in 12 months</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-secondary">${currentRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-1">{revenueProgress}% complete</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] h-4 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(revenueProgress, 100)}%` }}
            ></div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-secondary" />
              <span>Remaining: ${(monthlyGoal - currentRevenue).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-secondary" />
              <span>Last 30 Days</span>
            </div>
          </div>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Visitors"
            value={metrics?.total_visitors?.toLocaleString() || '0'}
            change="+12.5% vs last month"
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Page Views"
            value={metrics?.page_views?.toLocaleString() || '0'}
            change="+8.3% vs last month"
            icon={Eye}
            trend="up"
          />
          <StatCard
            title="Total Leads"
            value={metrics?.total_leads || 0}
            change={`${metrics?.conversion_rate?.toFixed(1) || 0}% conversion rate`}
            icon={TrendingUp}
            trend="up"
          />
          <StatCard
            title="Total Revenue"
            value={`$${currentRevenue.toLocaleString()}`}
            change="+22.1% vs last month"
            icon={DollarSign}
            trend="up"
          />
        </div>

        {/* Service Breakdown */}
        <Card className="p-6 mb-8">
          <h3 className="font-serif text-2xl font-bold mb-6">Service Performance (Last 30 Days)</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-[hsl(43_96%_96%)] to-white rounded-lg border">
              <div className="text-3xl mb-2">☀️</div>
              <h4 className="font-semibold mb-1">Tanning Studio</h4>
              <div className="text-2xl font-bold text-[hsl(var(--primary))]">{metrics?.tanning_bookings || 0}</div>
              <p className="text-sm text-muted-foreground">bookings</p>
              <p className="text-xs text-muted-foreground mt-2">
                ${metrics?.revenue_by_service?.tanning?.toFixed(0) || 0} revenue
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-[hsl(172_45%_94%)] to-white rounded-lg border">
              <div className="text-3xl mb-2">💅</div>
              <h4 className="font-semibold mb-1">Fast Nails</h4>
              <div className="text-2xl font-bold text-secondary">{metrics?.nails_bookings || 0}</div>
              <p className="text-sm text-muted-foreground">bookings</p>
              <p className="text-xs text-muted-foreground mt-2">
                ${metrics?.revenue_by_service?.nails?.toFixed(0) || 0} revenue
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-[hsl(183_45%_96%)] to-white rounded-lg border">
              <div className="text-3xl mb-2">🧺</div>
              <h4 className="font-semibold mb-1">Laundromat</h4>
              <div className="text-2xl font-bold text-secondary">{metrics?.laundry_customers || 0}</div>
              <p className="text-sm text-muted-foreground">customers</p>
              <p className="text-xs text-muted-foreground mt-2">
                ${metrics?.revenue_by_service?.laundry?.toFixed(0) || 0} revenue
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-[hsl(183_55%_90%)] to-white rounded-lg border">
              <div className="text-3xl mb-2">🧋</div>
              <h4 className="font-semibold mb-1">Fizze Drinks</h4>
              <div className="text-2xl font-bold text-secondary">{metrics?.drinks_orders || 0}</div>
              <p className="text-sm text-muted-foreground">orders</p>
              <p className="text-xs text-muted-foreground mt-2">
                ${metrics?.revenue_by_service?.drinks?.toFixed(0) || 0} revenue
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs for detailed sections */}
        <Tabs defaultValue="recommendations" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="recommendations" className="text-base">
              🤖 AI Recommendations ({recommendations.length})
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="text-base">
              📢 Active Campaigns ({campaigns.length})
            </TabsTrigger>
            <TabsTrigger value="leads" className="text-base">
              📋 Recent Leads ({leads.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations">
            <div className="space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <AIRecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    onImplement={handleImplementRecommendation}
                    onReject={handleRejectRecommendation}
                  />
                ))
              ) : (
                <Card className="p-8 text-center">
                  <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending AI recommendations at the moment.</p>
                  <p className="text-sm text-muted-foreground mt-2">The AI engine is analyzing your data...</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="campaigns">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))
              ) : (
                <Card className="p-8 text-center col-span-2">
                  <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active campaigns running.</p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Contact</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Service</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Source</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, index) => (
                      <tr key={lead.id} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                        <td className="px-4 py-3 text-sm font-medium">{lead.name || 'Anonymous'}</td>
                        <td className="px-4 py-3 text-sm">
                          {lead.email && <div className="text-xs">{lead.email}</div>}
                          {lead.phone && <div className="text-xs text-muted-foreground">{lead.phone}</div>}
                        </td>
                        <td className="px-4 py-3 text-sm capitalize">{lead.service_interest}</td>
                        <td className="px-4 py-3 text-sm capitalize">{lead.source.replace('_', ' ')}</td>
                        <td className="px-4 py-3">
                          <Badge className={
                            lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {lead.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Activity Summary */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-purple-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl font-bold mb-2">AI Engine Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Recommendations Generated</p>
                  <p className="text-2xl font-bold text-purple-600">{metrics?.ai_recommendations_generated || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Implemented</p>
                  <p className="text-2xl font-bold text-green-600">{metrics?.ai_recommendations_implemented || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-secondary">
                    {metrics?.ai_recommendations_generated > 0 
                      ? ((metrics.ai_recommendations_implemented / metrics.ai_recommendations_generated) * 100).toFixed(0)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
