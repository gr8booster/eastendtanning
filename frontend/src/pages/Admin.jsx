import { useState, useEffect } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { CampaignCard } from '../components/dashboard/CampaignCard';
import { AIRecommendationCard } from '../components/dashboard/AIRecommendationCard';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { 
  Users, Eye, TrendingUp, DollarSign, 
  Target, Zap, Calendar, Award,
  RefreshCw, Download, Sparkles, TicketPercent, FlaskConical
} from 'lucide-react';
import { toast } from 'sonner';

export default function Admin() {
  const [metrics, setMetrics] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [leads, setLeads] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [lotions, setLotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const adminHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchDashboardData();
    let intervalId;
    if (autoRefresh) intervalId = setInterval(() => fetchDashboardData(true), 60000);
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [autoRefresh]);

  const fetchDashboardData = async (isBackgroundRefresh = false) => {
    if (!isBackgroundRefresh) setLoading(true); else setRefreshing(true);
    try {
      const [metricsData, campaignsData, recsData, leadsData, discountsData, lotionsData] = await Promise.all([
        fetch(`${backendUrl}/api/dashboard/metrics`).then(r => r.ok ? r.json() : Promise.reject('metrics')),
        fetch(`${backendUrl}/api/campaigns?status=active`).then(r => r.ok ? r.json() : Promise.reject('campaigns')),
        fetch(`${backendUrl}/api/ai/recommendations?status=pending`).then(r => r.ok ? r.json() : Promise.reject('recs')),
        fetch(`${backendUrl}/api/leads?limit=10`).then(r => r.ok ? r.json() : Promise.reject('leads')),
        fetch(`${backendUrl}/api/discounts/list?status=all&limit=20`).then(r => r.ok ? r.json() : Promise.reject('discounts')),
        fetch(`${backendUrl}/api/lotions/admin/list`, { headers: { 'Content-Type': 'application/json', ...adminHeaders() }}).then(r => r.ok ? r.json() : [])
      ]);
      setMetrics(metricsData); setCampaigns(campaignsData); setRecommendations(recsData); setLeads(leadsData); setDiscounts(discountsData); setLotions(Array.isArray(lotionsData) ? lotionsData : []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (!isBackgroundRefresh) toast.error('Failed to load dashboard data');
    } finally { setLoading(false); setRefreshing(false); }
  };

  const handleGenerateRecommendations = async () => {
    setAiGenerating(true);
    toast.info('AI Engine starting...', { description: 'Analyzing your business data with GPT-4 and Claude' });
    try {
      await fetch(`${backendUrl}/api/ai/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ force_refresh: true }) });
      const response = await fetch(`${backendUrl}/api/ai/recommendations/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      const data = await response.json();
      toast.success(`Generated ${data.count} new recommendations!`, { description: 'Check the AI Recommendations tab' });
      fetchDashboardData();
    } catch (error) { console.error('Error generating recommendations:', error); toast.error('Failed to generate recommendations'); }
    finally { setAiGenerating(false); }
  };

  const [form, setForm] = useState({ name: '', brand: '', price: '', features: '', tattoo_guard: false, image_url: '', active: true });
  const submitLotion = async () => {
    try {
      if (!form.name || !form.price) { toast.error('Name and price required'); return; }
      const payload = { ...form, price: parseFloat(form.price), features: form.features ? form.features.split(',').map(s => s.trim()).filter(Boolean) : [] };
      const res = await fetch(`${backendUrl}/api/lotions`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...adminHeaders() }, body: JSON.stringify(payload) });
      if (!res.ok) { const j = await res.json(); throw new Error(j?.detail || 'Create failed'); }
      toast.success('Lotion created');
      setForm({ name: '', brand: '', price: '', features: '', tattoo_guard: false, image_url: '', active: true });
      fetchDashboardData(true);
    } catch (e) { console.error(e); toast.error(e.message || 'Failed to create lotion'); }
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
              <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">Eastend Command Center</h1>
              <p className="text-white/90">AI-Powered Marketing & Orchestration Dashboard</p>
              {lastUpdated && (
                <p className="text-white/70 text-sm mt-2" data-testid="last-updated">Last updated: {lastUpdated.toLocaleTimeString()} {autoRefresh && '• Auto-refresh enabled'}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" onClick={handleGenerateRecommendations} disabled={aiGenerating} className="bg-purple-600 hover:bg-purple-700 text-white border-0">
                {aiGenerating ? (<><RefreshCw className="w-4 h-4 mr-2 animate-spin" />AI Generating...</>) : (<><Sparkles className="w-4 h-4 mr-2" />Generate AI Insights</>)}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => fetchDashboardData(false)} disabled={refreshing} className="bg-white/20 hover:bg-white/30 text-white border-white/30" data-testid="refresh-button">
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />{refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Download className="w-4 h-4 mr-2" />Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1400px] py-8">
        {/* KPIs */}
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
            <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] h-4 rounded-full transition-colors duration-200" style={{ width: `${Math.min(revenueProgress, 100)}%` }}></div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="recommendations" className="mb-8">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="recommendations" className="text-base">🤖 AI Recommendations ({recommendations.length})</TabsTrigger>
            <TabsTrigger value="campaigns" className="text-base">📢 Active Campaigns ({campaigns.length})</TabsTrigger>
            <TabsTrigger value="leads" className="text-base">📋 Recent Leads ({leads.length})</TabsTrigger>
            <TabsTrigger value="discounts" className="text-base" data-testid="discounts-tab">🎟️ Discount Codes ({discounts.length})</TabsTrigger>
            <TabsTrigger value="lotions" className="text-base" data-testid="lotions-tab">🧴 Lotions ({lotions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations">
            <div className="space-y-4">
              {recommendations.length > 0 ? recommendations.map((rec) => (<AIRecommendationCard key={rec.id} recommendation={rec} />)) : (
                <Card className="p-8 text-center"><Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No pending AI recommendations at the moment.</p></Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="campaigns">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.length > 0 ? campaigns.map((c) => (<CampaignCard key={c.id} campaign={c} />)) : (
                <Card className="p-8 text-center col-span-2"><Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No active campaigns running.</p></Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <Card className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-muted"><tr><th className="px-4 py-3 text-left text-sm font-semibold">Name</th><th className="px-4 py-3 text-left text-sm font-semibold">Contact</th><th className="px-4 py-3 text-left text-sm font-semibold">Service</th><th className="px-4 py-3 text-left text-sm font-semibold">Source</th><th className="px-4 py-3 text-left text-sm font-semibold">Status</th><th className="px-4 py-3 text-left text-sm font-semibold">Date</th></tr></thead><tbody>{leads.map((lead, index) => (<tr key={lead.id} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}><td className="px-4 py-3 text-sm font-medium">{lead.name || 'Anonymous'}</td><td className="px-4 py-3 text-sm">{lead.email && <div className="text-xs">{lead.email}</div>}{lead.phone && <div className="text-xs text-muted-foreground">{lead.phone}</div>}</td><td className="px-4 py-3 text-sm capitalize">{lead.service_interest}</td><td className="px-4 py-3 text-sm capitalize">{lead.source?.replace('_',' ')}</td><td className="px-4 py-3"><Badge>{lead.status}</Badge></td><td className="px-4 py-3 text-sm text-muted-foreground">{new Date(lead.created_at).toLocaleDateString()}</td></tr>))}</tbody></table></div></Card>
          </TabsContent>

          <TabsContent value="discounts">
            <Card className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full" data-testid="discounts-table"><thead className="bg-muted"><tr><th className="px-4 py-3 text-left text-sm font-semibold">Code</th><th className="px-4 py-3 text-left text-sm font-semibold">Percent</th><th className="px-4 py-3 text-left text-sm font-semibold">Status</th><th className="px-4 py-3 text-left text-sm font-semibold">Expires</th><th className="px-4 py-3 text-left text-sm font-semibold">Created</th></tr></thead><tbody>{discounts.map((d, index) => (<tr key={d.id} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}><td className="px-4 py-3 text-sm font-mono">{d.code}</td><td className="px-4 py-3 text-sm">{d.percent_off}%</td><td className="px-4 py-3 text-sm capitalize">{d.status}</td><td className="px-4 py-3 text-sm">{new Date(d.expires_at).toLocaleString()}</td><td className="px-4 py-3 text-sm">{new Date(d.created_at).toLocaleString()}</td></tr>))}</tbody></table></div></Card>
          </TabsContent>

          <TabsContent value="lotions">
            <Card className="p-6">
              <h3 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2"><FlaskConical className="w-5 h-5" /> Lotions Catalog</h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
                <div className="md:col-span-2"><Label>Name</Label><Input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} data-testid="lotion-name" /></div>
                <div className="md:col-span-1"><Label>Brand</Label><Input value={form.brand} onChange={(e)=>setForm({...form, brand:e.target.value})} data-testid="lotion-brand" /></div>
                <div className="md:col-span-1"><Label>Price (USD)</Label><Input type="number" step="0.01" value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})} data-testid="lotion-price" /></div>
                <div className="md:col-span-2"><Label>Features (comma separated)</Label><Input value={form.features} onChange={(e)=>setForm({...form, features:e.target.value})} data-testid="lotion-features" /></div>
                <div className="md:col-span-3 flex items-center gap-2"><input id="tattoo" type="checkbox" checked={form.tattoo_guard} onChange={(e)=>setForm({...form, tattoo_guard:e.target.checked})} /><Label htmlFor="tattoo">Tattoo Guard</Label></div>
                <div className="md:col-span-3"><Label>Image URL</Label><Input value={form.image_url} onChange={(e)=>setForm({...form, image_url:e.target.value})} data-testid="lotion-image" /></div>
              </div>
              <div className="flex justify-end"><Button onClick={submitLotion} data-testid="create-lotion-button">Add Lotion</Button></div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full" data-testid="lotions-table"><thead className="bg-muted"><tr><th className="px-4 py-3 text-left text-sm font-semibold">Name</th><th className="px-4 py-3 text-left text-sm font-semibold">Brand</th><th className="px-4 py-3 text-left text-sm font-semibold">Price</th><th className="px-4 py-3 text-left text-sm font-semibold">Features</th><th className="px-4 py-3 text-left text-sm font-semibold">Tattoo</th><th className="px-4 py-3 text-left text-sm font-semibold">Active</th></tr></thead><tbody>{lotions.map((l, index) => (<tr key={l.id} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}><td className="px-4 py-3 text-sm">{l.name}</td><td className="px-4 py-3 text-sm">{l.brand || '-'}</td><td className="px-4 py-3 text-sm">${l.price?.toFixed ? l.price.toFixed(2) : l.price}</td><td className="px-4 py-3 text-sm">{(l.features||[]).join(', ')}</td><td className="px-4 py-3 text-sm">{l.tattoo_guard ? 'Yes' : 'No'}</td><td className="px-4 py-3 text-sm">{l.active ? 'Yes' : 'No'}</td></tr>))}</tbody></table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
