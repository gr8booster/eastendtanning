import { useState, useEffect } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { CampaignCard } from '../components/dashboard/CampaignCard';
import { AIRecommendationCard } from '../components/dashboard/AIRecommendationCard';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { 
  Users, Eye, TrendingUp, DollarSign, 
  Target, Zap, Calendar, Award,
  RefreshCw, Download, Sparkles, TicketPercent, FlaskConical, Phone,
  Coffee, Edit, Trash2, Plus, Search
} from 'lucide-react';
import { toast } from 'sonner';

export default function Admin() {
  const [metrics, setMetrics] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [leads, setLeads] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [lotions, setLotions] = useState([]);
  const [voiceCalls, setVoiceCalls] = useState([]);
  const [fizzeDrinks, setFizzeDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Fizze state
  const [showFizzeModal, setShowFizzeModal] = useState(false);
  const [editingDrink, setEditingDrink] = useState(null);
  const [fizzeForm, setFizzeForm] = useState({
    name: '', category: 'Milk Teas', flavor_profile: '', recipe: '', 
    price: '', image_url: '', available: true, coming_soon: false, display_order: 0
  });
  const [fizzeSearch, setFizzeSearch] = useState('');
  const [fizzeFilter, setFizzeFilter] = useState('all');
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersFilter, setOrdersFilter] = useState('all');
  
  // Users state
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    email: '', name: '', role: 'admin', password: '', active: true
  });

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
      const [metricsData, campaignsData, recsData, leadsData, discountsData, lotionsData, voiceCallsData, fizzeDrinksData, orderSettings, ordersData, usersData] = await Promise.all([
        fetch(`${backendUrl}/api/dashboard/metrics`).then(r => r.ok ? r.json() : Promise.reject('metrics')),
        fetch(`${backendUrl}/api/campaigns?status=active`).then(r => r.ok ? r.json() : Promise.reject('campaigns')),
        fetch(`${backendUrl}/api/ai/recommendations?status=pending`).then(r => r.ok ? r.json() : Promise.reject('recs')),
        fetch(`${backendUrl}/api/leads?limit=10`).then(r => r.ok ? r.json() : Promise.reject('leads')),
        fetch(`${backendUrl}/api/discounts/list?status=all&limit=20`).then(r => r.ok ? r.json() : Promise.reject('discounts')),
        fetch(`${backendUrl}/api/lotions/admin/list`, { headers: { 'Content-Type': 'application/json', ...adminHeaders() }}).then(r => r.ok ? r.json() : []),
        fetch(`${backendUrl}/api/voice/calls?limit=50`).then(r => r.ok ? r.json() : {calls: []}),
        fetch(`${backendUrl}/api/fizze/admin/drinks`, { headers: { 'Content-Type': 'application/json', ...adminHeaders() }}).then(r => r.ok ? r.json() : []),
        fetch(`${backendUrl}/api/orders/settings`).then(r => r.ok ? r.json() : {delivery_enabled: true}),
        fetch(`${backendUrl}/api/orders/list?limit=100`, { headers: { 'Content-Type': 'application/json', ...adminHeaders() }}).then(r => r.ok ? r.json() : []),
        fetch(`${backendUrl}/api/users/`, { headers: { 'Content-Type': 'application/json', ...adminHeaders() }}).then(r => r.ok ? r.json() : [])
      ]);
      setMetrics(metricsData); 
      setCampaigns(campaignsData); 
      setRecommendations(recsData); 
      setLeads(leadsData); 
      setDiscounts(discountsData); 
      setLotions(Array.isArray(lotionsData) ? lotionsData : []); 
      setVoiceCalls(voiceCallsData?.calls || []);
      setFizzeDrinks(Array.isArray(fizzeDrinksData) ? fizzeDrinksData : []);
      setDeliveryEnabled(orderSettings?.delivery_enabled ?? true);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
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

  // Lotion management
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

  // Fizze management
  const handleCreateFizzeDrink = () => {
    setEditingDrink(null);
    setFizzeForm({ name: '', category: 'Milk Teas', flavor_profile: '', recipe: '', price: '', image_url: '', available: true, coming_soon: false, display_order: 0 });
    setShowFizzeModal(true);
  };

  const handleEditFizzeDrink = (drink) => {
    setEditingDrink(drink);
    setFizzeForm({
      name: drink.name,
      category: drink.category,
      flavor_profile: drink.flavor_profile,
      recipe: drink.recipe,
      price: drink.price?.toString() || '',
      image_url: drink.image_url || '',
      available: drink.available,
      coming_soon: drink.coming_soon,
      display_order: drink.display_order
    });
    setShowFizzeModal(true);
  };

  const handleSaveFizzeDrink = async () => {
    try {
      if (!fizzeForm.name || !fizzeForm.category) {
        toast.error('Name and category required');
        return;
      }

      const payload = {
        ...fizzeForm,
        price: fizzeForm.price ? parseFloat(fizzeForm.price) : null
      };

      const url = editingDrink 
        ? `${backendUrl}/api/fizze/admin/drinks/${editingDrink.id}`
        : `${backendUrl}/api/fizze/admin/drinks`;
      
      const method = editingDrink ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const j = await res.json();
        throw new Error(j?.detail || 'Save failed');
      }

      toast.success(editingDrink ? 'Drink updated' : 'Drink created');
      setShowFizzeModal(false);
      fetchDashboardData(true);
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Failed to save drink');
    }
  };

  const handleDeleteFizzeDrink = async (drinkId) => {
    if (!confirm('Are you sure you want to delete this drink? This cannot be undone.')) return;

    try {
      const res = await fetch(`${backendUrl}/api/fizze/admin/drinks/${drinkId}`, {
        method: 'DELETE',
        headers: adminHeaders()
      });

      if (!res.ok) throw new Error('Delete failed');

      toast.success('Drink deleted');
      fetchDashboardData(true);
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete drink');
    }
  };

  const handleToggleAvailability = async (drinkId, currentValue) => {
    try {
      const res = await fetch(`${backendUrl}/api/fizze/admin/drinks/${drinkId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
        body: JSON.stringify({ available: !currentValue })
      });

      if (!res.ok) throw new Error('Toggle failed');

      toast.success('Availability updated');
      fetchDashboardData(true);
    } catch (e) {
      console.error(e);
      toast.error('Failed to update availability');
    }
  };

  const handleToggleDelivery = async () => {
    try {
      const newState = !deliveryEnabled;
      const res = await fetch(`${backendUrl}/api/orders/settings/delivery-toggle?enabled=${newState}`, {
        method: 'POST',
        headers: adminHeaders()
      });

      if (!res.ok) throw new Error('Toggle failed');

      setDeliveryEnabled(newState);
      toast.success(newState ? 'Delivery enabled' : 'Delivery disabled (pickup only)');
    } catch (e) {
      console.error(e);
      toast.error('Failed to toggle delivery');
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${backendUrl}/api/orders/${orderId}/status?status=${newStatus}`, {
        method: 'PATCH',
        headers: adminHeaders()
      });

      if (!res.ok) throw new Error('Status update failed');

      toast.success(`Order status updated to ${newStatus}`);
      fetchDashboardData(true);
    } catch (e) {
      console.error(e);
      toast.error('Failed to update order status');
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setUserForm({ email: '', name: '', role: 'admin', password: '', active: true });
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({ email: user.email, name: user.name, role: user.role, password: '', active: user.active });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    try {
      if (!userForm.email || !userForm.name || (editingUser ? false : !userForm.password)) {
        toast.error('Please fill all required fields');
        return;
      }

      const url = editingUser 
        ? `${backendUrl}/api/users/${editingUser.id}`
        : `${backendUrl}/api/users/`;
      
      const method = editingUser ? 'PATCH' : 'POST';
      const body = editingUser
        ? { name: userForm.name, role: userForm.role, active: userForm.active, ...(userForm.password && { password: userForm.password }) }
        : userForm;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Save failed');
      }

      toast.success(editingUser ? 'User updated' : 'User created');
      setShowUserModal(false);
      fetchDashboardData(true);
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Failed to save user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`${backendUrl}/api/users/${userId}`, {
        method: 'DELETE',
        headers: adminHeaders()
      });

      if (!res.ok) throw new Error('Delete failed');

      toast.success('User deleted');
      fetchDashboardData(true);
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete user');
    }
  };

  const filteredFizzeDrinks = fizzeDrinks.filter(drink => {
    const matchesSearch = drink.name.toLowerCase().includes(fizzeSearch.toLowerCase());
    const matchesFilter = fizzeFilter === 'all' || 
                          (fizzeFilter === 'available' && drink.available) ||
                          (fizzeFilter === 'unavailable' && !drink.available) ||
                          (fizzeFilter === 'coming_soon' && drink.coming_soon);
    return matchesSearch && matchesFilter;
  });

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

  const monthlyGoal = 83333.33;
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
          <TabsList className="grid w-full grid-cols-8 mb-6">
            <TabsTrigger value="recommendations" className="text-sm">🤖 AI Recs ({recommendations.length})</TabsTrigger>
            <TabsTrigger value="campaigns" className="text-sm">📢 Campaigns ({campaigns.length})</TabsTrigger>
            <TabsTrigger value="leads" className="text-sm">📋 Leads ({leads.length})</TabsTrigger>
            <TabsTrigger value="discounts" className="text-sm" data-testid="discounts-tab">🎟️ Discounts ({discounts.length})</TabsTrigger>
            <TabsTrigger value="lotions" className="text-sm" data-testid="lotions-tab">🧴 Lotions ({lotions.length})</TabsTrigger>
            <TabsTrigger value="voicecalls" className="text-sm" data-testid="voicecalls-tab"><Phone className="w-4 h-4 inline-block mr-1" />Calls ({voiceCalls.length})</TabsTrigger>
            <TabsTrigger value="fizze" className="text-sm" data-testid="fizze-tab"><Coffee className="w-4 h-4 inline-block mr-1" />Fizze ({fizzeDrinks.length})</TabsTrigger>
            <TabsTrigger value="orders" className="text-sm" data-testid="orders-tab">📦 Orders ({orders.length})</TabsTrigger>
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

          <TabsContent value="voicecalls">
            <Card className="overflow-hidden">
              <div className="p-4 bg-muted border-b">
                <h3 className="font-serif text-xl font-bold flex items-center gap-2">
                  <Phone className="w-5 h-5" /> Voice Call Log
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Recent AI voice calls with transcripts</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="voicecalls-table">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Direction</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Summary</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voiceCalls.length > 0 ? voiceCalls.map((call, index) => {
                      const summary = call.summary || call.transcript || '-';
                      const truncatedSummary = summary.length > 100 ? summary.substring(0, 100) + '...' : summary;
                      return (
                        <tr key={call.id} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                          <td className="px-4 py-3 text-sm font-medium">{call.customer_name || 'Unknown'}</td>
                          <td className="px-4 py-3 text-sm font-mono text-xs">{call.customer_number || '-'}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant={call.direction === 'inbound' ? 'default' : 'secondary'}>
                              {call.direction || 'unknown'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm capitalize">
                            <Badge variant={call.status === 'mocked' ? 'outline' : 'default'}>
                              {call.status || 'unknown'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs" title={summary}>
                            {truncatedSummary}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                            {call.created_at ? new Date(call.created_at).toLocaleString() : '-'}
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-muted-foreground">
                          No voice calls yet. Voice calls are currently in mock mode.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="fizze">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
                    <Coffee className="w-6 h-6" /> Fizze Drinks Menu
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Manage your bubble tea menu, toggle availability, and track votes</p>
                </div>
                <Button onClick={handleCreateFizzeDrink} data-testid="create-fizze-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Drink
                </Button>
              </div>

              {/* Delivery Toggle */}
              <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">Online Ordering Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      {deliveryEnabled ? 'Customers can order for pickup or delivery' : 'Pickup only - delivery is disabled'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{deliveryEnabled ? 'Delivery Enabled' : 'Pickup Only'}</span>
                    <Switch 
                      checked={deliveryEnabled}
                      onCheckedChange={handleToggleDelivery}
                      data-testid="delivery-toggle"
                    />
                  </div>
                </div>
              </Card>

              {/* Search and Filter */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search drinks..." 
                    value={fizzeSearch}
                    onChange={(e) => setFizzeSearch(e.target.value)}
                    className="pl-10"
                    data-testid="fizze-search"
                  />
                </div>
                <Select value={fizzeFilter} onValueChange={setFizzeFilter}>
                  <SelectTrigger className="w-48" data-testid="fizze-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Drinks</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                    <SelectItem value="coming_soon">Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Drinks Table */}
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="fizze-table">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Recipe</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Available</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Coming Soon</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Votes</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFizzeDrinks.length > 0 ? filteredFizzeDrinks.map((drink, index) => (
                      <tr key={drink.id} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                        <td className="px-4 py-3 text-sm font-medium">{drink.name}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant="outline">{drink.category}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {drink.price ? `$${drink.price.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs" title={drink.recipe}>
                          {drink.recipe.length > 50 ? drink.recipe.substring(0, 50) + '...' : drink.recipe}
                        </td>
                        <td className="px-4 py-3">
                          <Switch 
                            checked={drink.available}
                            onCheckedChange={() => handleToggleAvailability(drink.id, drink.available)}
                            data-testid={`fizze-available-${drink.id}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          {drink.coming_soon && <Badge variant="secondary">Coming Soon</Badge>}
                        </td>
                        <td className="px-4 py-3">
                          <Badge>{drink.votes || 0}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditFizzeDrink(drink)}
                              data-testid={`fizze-edit-${drink.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteFizzeDrink(drink.id)}
                              data-testid={`fizze-delete-${drink.id}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="8" className="px-4 py-8 text-center text-muted-foreground">
                          No drinks found. Create your first drink to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold">📦 Online Orders</h3>
                  <p className="text-sm text-muted-foreground mt-1">Manage Fizze drink orders and update status</p>
                </div>
                <Select value={ordersFilter} onValueChange={setOrdersFilter}>
                  <SelectTrigger className="w-48" data-testid="orders-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full" data-testid="orders-table">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Order #</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Items</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Delivery</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(order => ordersFilter === 'all' || order.status === ordersFilter).length > 0 ? 
                      orders.filter(order => ordersFilter === 'all' || order.status === ordersFilter).map((order, index) => (
                      <tr key={order.id} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                        <td className="px-4 py-3 text-sm font-medium">{order.order_number}</td>
                        <td className="px-4 py-3 text-sm">
                          <div>{order.customer_name}</div>
                          <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="max-w-xs">
                            {order.items.map((item, i) => (
                              <div key={i} className="text-xs">
                                {item.quantity}x {item.drink_name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold">${order.total.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant={order.delivery_method === 'pickup' ? 'outline' : 'default'}>
                            {order.delivery_method}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge 
                            variant={
                              order.status === 'completed' ? 'default' : 
                              order.status === 'cancelled' ? 'destructive' : 
                              order.status === 'ready' ? 'default' : 
                              'secondary'
                            }
                            data-testid={`order-status-${order.id}`}
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-1">
                            {order.status === 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOrderStatusUpdate(order.id, 'confirmed')}
                                data-testid={`order-confirm-${order.id}`}
                              >
                                Confirm
                              </Button>
                            )}
                            {order.status === 'confirmed' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOrderStatusUpdate(order.id, 'preparing')}
                                data-testid={`order-prepare-${order.id}`}
                              >
                                Prepare
                              </Button>
                            )}
                            {order.status === 'preparing' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOrderStatusUpdate(order.id, 'ready')}
                                data-testid={`order-ready-${order.id}`}
                              >
                                Ready
                              </Button>
                            )}
                            {order.status === 'ready' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOrderStatusUpdate(order.id, 'completed')}
                                data-testid={`order-complete-${order.id}`}
                              >
                                Complete
                              </Button>
                            )}
                            {!['completed', 'cancelled'].includes(order.status) && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleOrderStatusUpdate(order.id, 'cancelled')}
                                data-testid={`order-cancel-${order.id}`}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="8" className="px-4 py-8 text-center text-muted-foreground">
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fizze Modal */}
      <Dialog open={showFizzeModal} onOpenChange={setShowFizzeModal}>
        <DialogContent className="sm:max-w-2xl" data-testid="fizze-modal">
          <DialogHeader>
            <DialogTitle>
              {editingDrink ? 'Edit Drink' : 'Create New Drink'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Drink Name *</Label>
              <Input 
                value={fizzeForm.name}
                onChange={(e) => setFizzeForm({...fizzeForm, name: e.target.value})}
                placeholder="e.g., Classic Milk Tea"
                data-testid="fizze-modal-name"
              />
            </div>

            <div>
              <Label>Category *</Label>
              <Select value={fizzeForm.category} onValueChange={(val) => setFizzeForm({...fizzeForm, category: val})}>
                <SelectTrigger data-testid="fizze-modal-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Milk Teas">Milk Teas</SelectItem>
                  <SelectItem value="Fruit Teas">Fruit Teas</SelectItem>
                  <SelectItem value="Blended Ice">Blended Ice</SelectItem>
                  <SelectItem value="Hot Boba">Hot Boba</SelectItem>
                  <SelectItem value="House Specials">House Specials</SelectItem>
                  <SelectItem value="Toppings">Toppings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Price (USD)</Label>
              <Input 
                type="number"
                step="0.01"
                value={fizzeForm.price}
                onChange={(e) => setFizzeForm({...fizzeForm, price: e.target.value})}
                placeholder="5.99"
                data-testid="fizze-modal-price"
              />
            </div>

            <div className="col-span-2">
              <Label>Flavor Profile</Label>
              <Input 
                value={fizzeForm.flavor_profile}
                onChange={(e) => setFizzeForm({...fizzeForm, flavor_profile: e.target.value})}
                placeholder="e.g., Creamy, sweet, classic"
                data-testid="fizze-modal-flavor"
              />
            </div>

            <div className="col-span-2">
              <Label>Recipe / Ingredients</Label>
              <Textarea 
                value={fizzeForm.recipe}
                onChange={(e) => setFizzeForm({...fizzeForm, recipe: e.target.value})}
                placeholder="e.g., Black tea, milk, tapioca pearls, brown sugar"
                rows={3}
                data-testid="fizze-modal-recipe"
              />
            </div>

            <div className="col-span-2">
              <Label>Image URL (optional)</Label>
              <Input 
                value={fizzeForm.image_url}
                onChange={(e) => setFizzeForm({...fizzeForm, image_url: e.target.value})}
                placeholder="https://..."
                data-testid="fizze-modal-image"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch 
                checked={fizzeForm.available}
                onCheckedChange={(val) => setFizzeForm({...fizzeForm, available: val})}
                data-testid="fizze-modal-available"
              />
              <Label>Available</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch 
                checked={fizzeForm.coming_soon}
                onCheckedChange={(val) => setFizzeForm({...fizzeForm, coming_soon: val})}
                data-testid="fizze-modal-coming-soon"
              />
              <Label>Coming Soon</Label>
            </div>

            <div>
              <Label>Display Order</Label>
              <Input 
                type="number"
                value={fizzeForm.display_order}
                onChange={(e) => setFizzeForm({...fizzeForm, display_order: parseInt(e.target.value) || 0})}
                data-testid="fizze-modal-order"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFizzeModal(false)}>Cancel</Button>
            <Button onClick={handleSaveFizzeDrink} data-testid="fizze-modal-save">
              {editingDrink ? 'Update Drink' : 'Create Drink'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
