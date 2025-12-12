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
  Coffee, Edit, Trash2, Plus, Search, LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import { ROLES, hasPermission, PERMISSIONS } from '../utils/permissions';
import { DealsManager } from '../components/admin/DealsManager';
import { MaryTraining } from '../components/admin/MaryTraining';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('recommendations');
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
  const [fizzeOrders, setFizzeOrders] = useState([]);
  const [tanningOrders, setTanningOrders] = useState([]);
  const [fizzeOrdersFilter, setFizzeOrdersFilter] = useState('all');
  const [tanningOrdersFilter, setTanningOrdersFilter] = useState('all');
  const [ordersFilter, setOrdersFilter] = useState('all');
  const [orderTypeTab, setOrderTypeTab] = useState('all');
  const [fizzeDrinksMenu, setFizzeDrinksMenu] = useState([]);
  const [showSunlinkModal, setShowSunlinkModal] = useState(false);
  const [selectedTanningOrder, setSelectedTanningOrder] = useState(null);
  const [sunlinkStaffName, setSunlinkStaffName] = useState('');
  const [sunlinkConfirmed, setSunlinkConfirmed] = useState(false);
  
  // Notifications state
  const [newOrderNotification, setNewOrderNotification] = useState(null);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  
  // Reviews state
  const [pendingReviews, setPendingReviews] = useState([]);
  
  const generateReceipt = (order) => {
    const receiptContent = `
EASTEND TANNING & LAUNDRY
818 Coshocton Ave, Mt Vernon, OH 43050
Phone: (740) 397-9632
Email: eastendtanninglaundrynutrition@outlook.com

==========================================
           ${order.order_type === 'tanning' ? 'TANNING' : 'FIZZE DRINKS'} ORDER RECEIPT
==========================================

Order #: ${order.order_number}
Date: ${new Date(order.created_at).toLocaleString()}

CUSTOMER INFORMATION:
Name: ${order.customer_name}
Phone: ${order.customer_phone}
Email: ${order.customer_email}

ORDER DETAILS:
${order.order_type === 'tanning' ? `
Bed Type: ${order.level_label}
Package: ${order.package_label}

PRICING:
Subtotal:     $${order.subtotal?.toFixed(2)}
Sales Tax:    $${order.sales_tax?.toFixed(2)}
Tan Tax:      $${order.tan_tax?.toFixed(2)}
-------------------------------------------
TOTAL:        $${order.total?.toFixed(2)}

PAYMENT STATUS: ${order.paid ? `PAID via ${order.payment_method || 'N/A'}` : 'NOT PAID'}
${order.paid ? `Paid At: ${new Date(order.paid_at).toLocaleString()}` : ''}

SUNLINK ENTRY: ${order.sunlink_entered ? `ENTERED by ${order.sunlink_entered_by} at ${new Date(order.sunlink_entered_at).toLocaleString()}` : 'NOT YET ENTERED'}
` : `
Items:
${order.items?.map(item => `${item.quantity}x ${item.drink_name} @ $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`).join('\n')}

PRICING:
Subtotal:     $${order.subtotal?.toFixed(2)}
Tax:          $${order.tax?.toFixed(2)}
Delivery Fee: $${order.delivery_fee?.toFixed(2)}
Tip:          $${order.tip_amount?.toFixed(2) || '0.00'}
-------------------------------------------
TOTAL:        $${order.total?.toFixed(2)}

PAYMENT STATUS: ${order.payment_method && order.payment_method !== 'cash_on_delivery' ? 'PAID ONLINE via ' + order.payment_method : 'CASH ON PICKUP/DELIVERY'}
Delivery Method: ${order.delivery_method}
Order Status: ${order.status}
`}

==========================================
          Thank you for your business!
==========================================
`;
    
    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${order.order_number}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Receipt downloaded');
  };
  
  // Users state
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    email: '', name: '', role: 'admin', password: '', active: true
  });
  
  // Recipes state
  const [recipesSearch, setRecipesSearch] = useState('');
  const [recipesCategoryFilter, setRecipesCategoryFilter] = useState('all');
  
  // Current user role (default to owner for now, should fetch from /api/users/me)
  const [currentUserRole, setCurrentUserRole] = useState(ROLES.OWNER);

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
      const [metricsData, campaignsData, recsData, leadsData, discountsData, lotionsData, voiceCallsData, fizzeDrinksData, orderSettings, fizzeOrdersData, tanningOrdersData, usersData] = await Promise.all([
        fetch(`${backendUrl}/api/dashboard/metrics`).then(r => r.ok ? r.json() : Promise.reject('metrics')),
        fetch(`${backendUrl}/api/campaigns?status=active`, { headers: { 'Content-Type': 'application/json', ...adminHeaders() }}).then(r => r.ok ? r.json() : Promise.reject('campaigns')),
        fetch(`${backendUrl}/api/ai/recommendations?status=pending`).then(r => r.ok ? r.json() : Promise.reject('recs')),
        fetch(`${backendUrl}/api/leads?limit=10`, { headers: { 'Content-Type': 'application/json', ...adminHeaders() }}).then(r => r.ok ? r.json() : Promise.reject('leads')),
        fetch(`${backendUrl}/api/discounts/list?status=all&limit=20`).then(r => r.ok ? r.json() : Promise.reject('discounts')),
        fetch(`${backendUrl}/api/lotions/admin/list`, { headers: { 'Content-Type': 'application/json', ...adminHeaders() }}).then(r => r.ok ? r.json() : []),
        fetch(`${backendUrl}/api/voice/calls?limit=50`).then(r => r.ok ? r.json() : {calls: []}),
        fetch(`${backendUrl}/api/fizze/admin/drinks`, { headers: { 'Content-Type': 'application/json', ...adminHeaders() }}).then(r => r.ok ? r.json() : []),
        fetch(`${backendUrl}/api/orders/settings`).then(r => r.ok ? r.json() : {delivery_enabled: true}),
        fetch(`${backendUrl}/api/orders/list?limit=100`, { headers: { 'Content-Type': 'application/json', ...adminHeaders() }}).then(r => r.ok ? r.json() : []),
        fetch(`${backendUrl}/api/tanning/orders/list?limit=100`, { headers: { 'Content-Type': 'application/json', ...adminHeaders() }}).then(r => r.ok ? r.json() : []),
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
      
      // Separate Fizze and Tanning orders
      const fizzeOrdersList = (Array.isArray(fizzeOrdersData) ? fizzeOrdersData : []).map(o => ({...o, order_type: 'fizze'}));
      const tanningOrdersList = (Array.isArray(tanningOrdersData) ? tanningOrdersData : []).map(o => ({
        ...o,
        order_type: 'tanning',
        order_number: o.order_code,
        status: o.paid ? 'completed' : 'pending',
        total: o.total
      }));
      
      setFizzeOrders(fizzeOrdersList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      setTanningOrders(tanningOrdersList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      
      // Combined for legacy compatibility
      const allOrders = [...fizzeOrdersList, ...tanningOrdersList].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(allOrders);

      // Fetch Fizze drinks menu for recipe display
      const menuRes = await fetch(`${backendUrl}/api/fizze/menu`);
      const menuData = await menuRes.json();
      const allDrinks = Object.values(menuData).flat();
      setFizzeDrinksMenu(allDrinks);
      
      // Fetch pending reviews
      const reviewsRes = await fetch(`${backendUrl}/api/reviews/pending`, { headers: adminHeaders() });
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setPendingReviews(reviewsData.pending_reviews || []);
      }
      
      // Check for new orders and show notification
      const totalCount = allOrders.length;
      if (isBackgroundRefresh && totalCount > lastOrderCount) {
        const newOrders = allOrders.slice(0, totalCount - lastOrderCount);
        const newOrder = newOrders[0];
        setNewOrderNotification({
          type: newOrder.order_type,
          orderNumber: newOrder.order_number || newOrder.order_code,
          customerName: newOrder.customer_name,
          total: newOrder.total,
          items: newOrder.items || []
        });
        // Play notification sound
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZjTkIG2m98OScTgwOUKvo7rdfHQU7k9n0yH0vBSh+zPLaizsKG2W48OihUBELTKXh8bllHgU2jdXzxHswBSuBzvLZjDgIG2m88OSdTgwOUKvo7rdfHQU7k9n0yH0vBSh+zPLaizsKG2W48OihUBELTKXh8bllHgU2jdXzxHswBSuBzvLZjDgIG2m88OSdTg==');
          audio.play();
        } catch (e) {
          console.log('Could not play notification sound');
        }
      }
      setLastOrderCount(totalCount);
      
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

  const handleImplementRecommendation = async (recId) => {
    try {
      const response = await fetch(`${backendUrl}/api/ai/recommendations/${recId}/implement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...adminHeaders() }
      });
      if (!response.ok) throw new Error('Failed to implement recommendation');
      const data = await response.json();
      toast.success('Recommendation implemented successfully!', { description: data.message || 'Changes have been applied' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error implementing recommendation:', error);
      toast.error('Failed to implement recommendation', { description: error.message });
    }
  };

  const handleRejectRecommendation = async (recId) => {
    try {
      const response = await fetch(`${backendUrl}/api/ai/recommendations/${recId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...adminHeaders() }
      });
      if (!response.ok) throw new Error('Failed to reject recommendation');
      toast.success('Recommendation dismissed');
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting recommendation:', error);
      toast.error('Failed to dismiss recommendation');
    }
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

  const handleMarkSunlinkEntered = async () => {
    if (!sunlinkStaffName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!sunlinkConfirmed) {
      toast.error('Please confirm entry into Sunlink');
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/tanning/mark-sunlink-entered`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
        body: JSON.stringify({
          order_id: selectedTanningOrder.order_id,
          staff_name: sunlinkStaffName.trim()
        })
      });

      if (!res.ok) throw new Error('Failed to mark as entered');

      toast.success(`✅ Order marked as entered by ${sunlinkStaffName}`);
      setShowSunlinkModal(false);
      setSunlinkStaffName('');
      setSunlinkConfirmed(false);
      setSelectedTanningOrder(null);
      fetchDashboardData(true);
    } catch (e) {
      console.error(e);
      toast.error('Failed to update order. Please try again.');
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

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast.success('Logged out successfully');
    window.location.href = '/admin';
  };

  const filteredFizzeDrinks = fizzeDrinks.filter(drink => {
    const matchesSearch = drink.name.toLowerCase().includes(fizzeSearch.toLowerCase());
    const matchesFilter = fizzeFilter === 'all' || 
                          (fizzeFilter === 'available' && drink.available) ||
                          (fizzeFilter === 'unavailable' && !drink.available) ||
                          (fizzeFilter === 'coming_soon' && drink.coming_soon);
    return matchesSearch && matchesFilter;
  });

  // Check if user can see a specific tab
  const canSeeTab = (tabName) => {
    const tabPermissions = {
      'recommendations': PERMISSIONS.ANALYTICS_VIEW,
      'campaigns': PERMISSIONS.CAMPAIGNS_READ,
      'leads': PERMISSIONS.LEADS_READ,
      'discounts': PERMISSIONS.ANALYTICS_VIEW,
      'lotions': PERMISSIONS.LOTIONS_MANAGE,
      'voicecalls': PERMISSIONS.VOICE_READ,
      'fizze': PERMISSIONS.FIZZE_MANAGE,
      'orders': PERMISSIONS.FIZZE_MANAGE,
      'users': PERMISSIONS.USERS_MANAGE,
      'recipes': PERMISSIONS.FIZZE_MANAGE,
      'deals': PERMISSIONS.ANALYTICS_VIEW,
      'marytraining': PERMISSIONS.ANALYTICS_VIEW
    };
    
    const permission = tabPermissions[tabName];
    if (!permission) return true;
    return hasPermission(currentUserRole, permission);
  };

  const handlePrintRecipes = () => {
    window.print();
  };

  const filteredRecipesDrinks = fizzeDrinks.filter(drink => {
    const matchesSearch = drink.name.toLowerCase().includes(recipesSearch.toLowerCase());
    const matchesCategory = recipesCategoryFilter === 'all' || drink.category === recipesCategoryFilter;
    return matchesSearch && matchesCategory && drink.available;
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
              <Button variant="secondary" size="sm" onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white border-0" data-testid="logout-button">
                <LogOut className="w-4 h-4 mr-2" />Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-[1400px] py-8">
        {/* New Orders Notification Banner */}
        {orders.filter(o => o.status === 'pending').length > 0 && (
          <Card className="p-4 mb-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-400 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔔</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-orange-900">
                    {orders.filter(o => o.status === 'pending').length} New Order{orders.filter(o => o.status === 'pending').length > 1 ? 's' : ''} Waiting!
                  </h3>
                  <p className="text-sm text-orange-700">
                    {orders.filter(o => o.status === 'pending').map(o => `${o.order_type === 'tanning' ? '☀️' : '🥤'} ${o.order_number}`).join(', ')} - 
                    Total: ${orders.filter(o => o.status === 'pending').reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setActiveTab('orders');
                  setOrdersFilter('pending');
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              >
                View Orders →
              </Button>
            </div>
          </Card>
        )}

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className={`grid w-full mb-6`} style={{gridTemplateColumns: `repeat(${[canSeeTab('recommendations'), canSeeTab('campaigns'), canSeeTab('leads'), canSeeTab('discounts'), canSeeTab('lotions'), canSeeTab('voicecalls'), canSeeTab('fizze'), canSeeTab('orders'), canSeeTab('orders'), canSeeTab('deals'), canSeeTab('marytraining'), canSeeTab('users'), canSeeTab('recipes')].filter(Boolean).length}, minmax(0, 1fr))`}}>
            {canSeeTab('recommendations') && <TabsTrigger value="recommendations" className="text-sm">🤖 AI Recs ({recommendations.length})</TabsTrigger>}
            {canSeeTab('campaigns') && <TabsTrigger value="campaigns" className="text-sm">📢 Campaigns ({campaigns.length})</TabsTrigger>}
            {canSeeTab('leads') && <TabsTrigger value="leads" className="text-sm">📋 Leads ({leads.length})</TabsTrigger>}
            {canSeeTab('discounts') && <TabsTrigger value="discounts" className="text-sm" data-testid="discounts-tab">🎟️ Discounts ({discounts.length})</TabsTrigger>}
            {canSeeTab('lotions') && <TabsTrigger value="lotions" className="text-sm" data-testid="lotions-tab">🧴 Lotions ({lotions.length})</TabsTrigger>}
            {canSeeTab('voicecalls') && <TabsTrigger value="voicecalls" className="text-sm" data-testid="voicecalls-tab"><Phone className="w-4 h-4 inline-block mr-1" />Calls ({voiceCalls.length})</TabsTrigger>}
            {canSeeTab('fizze') && <TabsTrigger value="fizze" className="text-sm" data-testid="fizze-tab"><Coffee className="w-4 h-4 inline-block mr-1" />Fizze ({fizzeDrinks.length})</TabsTrigger>}
            {canSeeTab('orders') && <TabsTrigger value="fizzeorders" className="text-sm" data-testid="fizze-orders-tab">🥤 Fizze Orders ({fizzeOrders.length})</TabsTrigger>}
            {canSeeTab('orders') && <TabsTrigger value="tanningorders" className="text-sm" data-testid="tanning-orders-tab">☀️ Tanning Orders ({tanningOrders.length})</TabsTrigger>}
            {canSeeTab('orders') && <TabsTrigger value="reviews" className="text-sm" data-testid="reviews-tab">⭐ Reviews</TabsTrigger>}
            {canSeeTab('deals') && <TabsTrigger value="deals" className="text-sm" data-testid="deals-tab">🎯 Deal of Month</TabsTrigger>}
            {canSeeTab('marytraining') && <TabsTrigger value="marytraining" className="text-sm" data-testid="marytraining-tab">🤖 Mary Training</TabsTrigger>}
            {canSeeTab('users') && <TabsTrigger value="users" className="text-sm" data-testid="users-tab"><Users className="w-4 h-4 inline-block mr-1" />Users ({users.length})</TabsTrigger>}
            {canSeeTab('recipes') && <TabsTrigger value="recipes" className="text-sm" data-testid="recipes-tab">📖 Recipes ({fizzeDrinks.filter(d => d.available).length})</TabsTrigger>}
          </TabsList>

          <TabsContent value="recommendations">
            <div className="space-y-4">
              {recommendations.length > 0 ? recommendations.map((rec) => (
                <AIRecommendationCard 
                  key={rec.id} 
                  recommendation={rec} 
                  onImplement={handleImplementRecommendation}
                  onReject={handleRejectRecommendation}
                />
              )) : (
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

          {/* Fizze Orders Tab */}
          <TabsContent value="fizzeorders">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
                    🥤 Fizze Drinks Orders
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Manage online drink orders - clearly see what to make</p>
                </div>
                <Select value={fizzeOrdersFilter} onValueChange={setFizzeOrdersFilter}>
                  <SelectTrigger className="w-48" data-testid="fizze-orders-filter">
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
                <table className="w-full" data-testid="fizze-orders-table">
                  <thead className="bg-teal-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Order #</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Items to Make</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Payment</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fizzeOrders.filter(order => fizzeOrdersFilter === 'all' || order.status === fizzeOrdersFilter).length > 0 ? 
                      fizzeOrders.filter(order => fizzeOrdersFilter === 'all' || order.status === fizzeOrdersFilter).map((order, index) => (
                      <tr key={order.id} className={index % 2 === 0 ? 'bg-white' : 'bg-teal-50/30'}>
                        <td className="px-4 py-3 text-sm font-bold text-teal-700">{order.order_number}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="font-semibold">{order.customer_name}</div>
                          <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
                          <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1 max-w-xs">
                            {order.items?.map((item, i) => (
                              <div key={i} className="bg-teal-100 border border-teal-300 rounded px-3 py-2">
                                <div className="font-bold text-teal-900 text-base">
                                  {item.quantity}x {item.drink_name}
                                </div>
                                {item.customizations && (
                                  <div className="text-xs text-teal-700 mt-1">
                                    {item.customizations}
                                  </div>
                                )}
                                <div className="text-xs text-teal-600 mt-1">
                                  ${item.price.toFixed(2)} each = ${(item.quantity * item.price).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="font-bold text-lg text-green-600">${order.total.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">
                            {order.delivery_method === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {order.payment_method && order.payment_method !== 'cash_on_delivery' ? (
                            <Badge className="bg-green-600 text-white">
                              💳 Paid Online
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-600 text-white">
                              💵 Cash
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge 
                            variant={
                              order.status === 'completed' ? 'default' : 
                              order.status === 'cancelled' ? 'destructive' : 
                              order.status === 'ready' ? 'default' : 
                              'secondary'
                            }
                            className={
                              order.status === 'ready' ? 'bg-green-600' :
                              order.status === 'preparing' ? 'bg-blue-600' :
                              order.status === 'confirmed' ? 'bg-purple-600' : ''
                            }
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => generateReceipt(order)}
                              className="w-full text-xs"
                            >
                              📄 Receipt
                            </Button>
                            
                            <div className="flex gap-1">
                              {order.status === 'pending' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleOrderStatusUpdate(order.id, 'confirmed')}
                                  className="flex-1 bg-purple-50"
                                >
                                  ✓
                                </Button>
                              )}
                              {order.status === 'confirmed' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleOrderStatusUpdate(order.id, 'preparing')}
                                  className="flex-1 bg-blue-50"
                                >
                                  🥤
                                </Button>
                              )}
                              {order.status === 'preparing' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleOrderStatusUpdate(order.id, 'ready')}
                                  className="flex-1 bg-green-50"
                                >
                                  ✓
                                </Button>
                              )}
                              {order.status === 'ready' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleOrderStatusUpdate(order.id, 'completed')}
                                  className="flex-1 bg-gray-50"
                                >
                                  Done
                                </Button>
                              )}
                              {!['completed', 'cancelled'].includes(order.status) && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleOrderStatusUpdate(order.id, 'cancelled')}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="8" className="px-4 py-8 text-center text-muted-foreground">
                          No Fizze orders yet. Orders will appear here when customers order online.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Tanning Orders Tab */}
          <TabsContent value="tanningorders">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
                    ☀️ Tanning Package Orders
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Manage tanning package orders and Sunlink entries</p>
                </div>
                <Select value={tanningOrdersFilter} onValueChange={setTanningOrdersFilter}>
                  <SelectTrigger className="w-48" data-testid="tanning-orders-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Not Paid</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="sunlink_pending">Sunlink Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full" data-testid="tanning-orders-table">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Order #</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Package Details</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Payment</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Sunlink</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tanningOrders.filter(order => {
                      if (tanningOrdersFilter === 'all') return true;
                      if (tanningOrdersFilter === 'pending') return !order.paid;
                      if (tanningOrdersFilter === 'paid') return order.paid;
                      if (tanningOrdersFilter === 'sunlink_pending') return order.paid && !order.sunlink_entered;
                      if (tanningOrdersFilter === 'completed') return order.paid && order.sunlink_entered;
                      return true;
                    }).length > 0 ? 
                      tanningOrders.filter(order => {
                        if (tanningOrdersFilter === 'all') return true;
                        if (tanningOrdersFilter === 'pending') return !order.paid;
                        if (tanningOrdersFilter === 'paid') return order.paid;
                        if (tanningOrdersFilter === 'sunlink_pending') return order.paid && !order.sunlink_entered;
                        if (tanningOrdersFilter === 'completed') return order.paid && order.sunlink_entered;
                        return true;
                      }).map((order, index) => (
                      <tr key={order.order_id} className={index % 2 === 0 ? 'bg-white' : 'bg-orange-50/30'}>
                        <td className="px-4 py-3 text-sm font-bold text-orange-700">{order.order_number}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="font-semibold">{order.customer_name}</div>
                          <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
                          <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="bg-orange-100 border border-orange-300 rounded px-3 py-2 space-y-1">
                            <div className="font-bold text-orange-900">{order.level_label}</div>
                            <div className="text-sm font-semibold text-orange-800">{order.package_label}</div>
                            {order.black_friday_deal && (
                              <Badge className="bg-yellow-500 text-black text-xs">
                                ⚡ BLACK FRIDAY BOGO
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="font-bold text-lg text-green-600">${order.total?.toFixed(2)}</div>
                          {order.black_friday_deal && order.savings && (
                            <div className="text-xs text-green-600">Saved: ${order.savings.toFixed(2)}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {order.paid ? (
                            <div className="space-y-1">
                              <Badge className="bg-green-600 text-white">
                                ✅ Paid
                              </Badge>
                              {order.payment_method && (
                                <div className="text-xs text-muted-foreground">
                                  via {order.payment_method}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Badge className="bg-red-600 text-white">
                              ❌ Not Paid
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {order.sunlink_entered ? (
                            <div className="bg-green-50 border border-green-300 rounded px-2 py-1">
                              <div className="text-xs font-semibold text-green-900">✅ Entered</div>
                              <div className="text-xs text-green-800">
                                By: {order.sunlink_entered_by}
                              </div>
                            </div>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => generateReceipt(order)}
                              className="w-full text-xs"
                            >
                              📄 Receipt
                            </Button>
                            
                            {!order.paid && (
                              <Button
                                size="sm"
                                onClick={async () => {
                                  try {
                                    const paymentMethod = prompt('Payment method? (e.g., PayPal, Stripe, Cash)');
                                    if (!paymentMethod) return;
                                    
                                    const res = await fetch(`${backendUrl}/api/tanning/mark-paid`, {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json', ...adminHeaders() },
                                      body: JSON.stringify({ order_id: order.order_id, payment_method: paymentMethod })
                                    });
                                    if (!res.ok) throw new Error('Failed to mark as paid');
                                    toast.success('Order marked as paid');
                                    fetchDashboardData(true);
                                  } catch (e) {
                                    toast.error('Failed to update payment status');
                                  }
                                }}
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                              >
                                ✓ Mark Paid
                              </Button>
                            )}
                            
                            {order.paid && !order.sunlink_entered && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedTanningOrder(order);
                                  setShowSunlinkModal(true);
                                }}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                              >
                                Enter in Sunlink
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="8" className="px-4 py-8 text-center text-muted-foreground">
                          No tanning orders yet. Orders will appear here when customers purchase packages online.
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
                  <p className="text-sm text-muted-foreground mt-1">Manage Fizze drinks and tanning package orders</p>
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
                      <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Order #</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Details</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(order => ordersFilter === 'all' || order.status === ordersFilter).length > 0 ? 
                      orders.filter(order => ordersFilter === 'all' || order.status === ordersFilter).map((order, index) => (
                      <tr key={order.id || order.order_id} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant={order.order_type === 'tanning' ? 'default' : 'secondary'} className={order.order_type === 'tanning' ? 'bg-orange-500' : 'bg-teal-500'}>
                            {order.order_type === 'tanning' ? '☀️ Tanning' : '🥤 Fizze'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">{order.order_number}</td>
                        <td className="px-4 py-3 text-sm">
                          <div>{order.customer_name}</div>
                          <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="max-w-xs space-y-2">
                            {order.order_type === 'fizze' ? (
                              order.items?.map((item, i) => {
                                const drink = fizzeDrinksMenu.find(d => d.name === item.drink_name);
                                return (
                                  <div key={i} className="border-l-2 border-teal-500 pl-2 mb-2">
                                    <div className="text-xs font-semibold text-teal-900">
                                      {item.quantity}x {item.drink_name}
                                    </div>
                                    {drink && drink.recipe && (
                                      <div className="text-xs text-muted-foreground mt-1 italic">
                                        📝 {drink.recipe}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <>
                                <div className="text-xs font-bold text-orange-700">{order.level_label}</div>
                                <div className="text-xs font-semibold">{order.package_label}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Subtotal: ${order.subtotal?.toFixed(2)}<br/>
                                  Sales Tax: ${order.sales_tax?.toFixed(2)}<br/>
                                  Tan Tax: ${order.tan_tax?.toFixed(2)}
                                </div>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => generateReceipt(order)}
                              className="text-xs"
                            >
                              📄 Download Receipt
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold">${order.total.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">
                          {order.order_type === 'tanning' ? (
                            <div className="space-y-1">
                              <Badge 
                                variant={order.paid ? 'default' : 'destructive'}
                                className={order.paid ? 'bg-green-600' : 'bg-red-600'}
                              >
                                {order.paid ? '✅ Paid' : '❌ Not Paid'}
                              </Badge>
                              {order.paid && order.payment_method && (
                                <div className="text-xs text-muted-foreground">
                                  via {order.payment_method}
                                </div>
                              )}
                            </div>
                          ) : (
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
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {order.order_type === 'tanning' ? (
                            <div className="space-y-2">
                              <div className="bg-orange-50 border border-orange-200 rounded px-2 py-1">
                                <div className="text-xs font-semibold text-orange-900">For Sunlink Entry:</div>
                                <div className="text-xs text-orange-800 mt-1">
                                  <strong>Bed:</strong> {order.level_label}<br/>
                                  <strong>Package:</strong> {order.package_label}<br/>
                                  <strong>Total:</strong> ${order.total?.toFixed(2)}<br/>
                                  <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}<br/>
                                  <strong>Skin Type:</strong> Not collected
                                </div>
                              </div>
                              
                              {!order.paid && (
                                <Button
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      const paymentMethod = prompt('Payment method? (e.g., PayPal, Stripe, Cash)');
                                      if (!paymentMethod) return;
                                      
                                      const res = await fetch(`${backendUrl}/api/tanning/mark-paid`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
                                        body: JSON.stringify({ order_id: order.order_id, payment_method: paymentMethod })
                                      });
                                      if (!res.ok) throw new Error('Failed to mark as paid');
                                      toast.success('Order marked as paid');
                                      fetchDashboardData(true);
                                    } catch (e) {
                                      toast.error('Failed to update payment status');
                                    }
                                  }}
                                  className="w-full bg-green-600 hover:bg-green-700"
                                >
                                  ✓ Mark as Paid
                                </Button>
                              )}
                              
                              {order.paid && !order.sunlink_entered && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTanningOrder(order);
                                    setShowSunlinkModal(true);
                                  }}
                                  className="w-full bg-orange-600 hover:bg-orange-700"
                                >
                                  Mark as Entered in Sunlink
                                </Button>
                              )}
                              
                              {order.sunlink_entered && (
                                <div className="bg-green-50 border border-green-300 rounded px-2 py-1">
                                  <div className="text-xs font-semibold text-green-900">✅ Entered in Sunlink</div>
                                  <div className="text-xs text-green-800 mt-1">
                                    By: {order.sunlink_entered_by}<br/>
                                    {new Date(order.sunlink_entered_at).toLocaleString()}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
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
                          )}
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

          {/* Deals Tab */}
          <TabsContent value="deals">
            <DealsManager />
          </TabsContent>

          {/* Mary Training Tab */}
          <TabsContent value="marytraining">
            <MaryTraining />
          </TabsContent>

          {/* Recipes Tab (Staff Only - Printable) */}
          <TabsContent value="recipes">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6 print:mb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
                    📖 Fizze Drink Recipes
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Complete recipe guide for staff - Kitchen Reference</p>
                </div>
                <Button onClick={handlePrintRecipes} className="print:hidden" data-testid="print-recipes-button">
                  <Download className="w-4 h-4 mr-2" />
                  Print Recipes
                </Button>
              </div>

              {/* Search and Filter - Hidden in print */}
              <div className="flex gap-3 mb-4 print:hidden">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search recipes..." 
                    value={recipesSearch}
                    onChange={(e) => setRecipesSearch(e.target.value)}
                    className="pl-10"
                    data-testid="recipes-search"
                  />
                </div>
                <Select value={recipesCategoryFilter} onValueChange={setRecipesCategoryFilter}>
                  <SelectTrigger className="w-48" data-testid="recipes-category-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Milk Teas">Milk Teas</SelectItem>
                    <SelectItem value="Fruit Teas">Fruit Teas</SelectItem>
                    <SelectItem value="Blended Ice">Blended Ice</SelectItem>
                    <SelectItem value="Hot Boba">Hot Boba</SelectItem>
                    <SelectItem value="House Specials">House Specials</SelectItem>
                    <SelectItem value="Dirty Sodas">Dirty Sodas</SelectItem>
                    <SelectItem value="Shakes">Shakes</SelectItem>
                    <SelectItem value="Toppings">Toppings</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Recipes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2" data-testid="recipes-grid">
                {filteredRecipesDrinks.length > 0 ? filteredRecipesDrinks.map((drink) => (
                  <Card key={drink.id} className="p-4 print:p-2 print:break-inside-avoid">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg print:text-base">{drink.name}</h4>
                        <Badge variant="outline" className="mt-1 text-xs">{drink.category}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg print:text-base text-primary">${drink.price?.toFixed(2) || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {drink.flavor_profile && (
                      <p className="text-sm text-muted-foreground italic mb-2 print:text-xs">{drink.flavor_profile}</p>
                    )}
                    
                    <div className="bg-muted p-3 rounded-md print:p-2">
                      <p className="font-semibold text-sm mb-1 print:text-xs">Recipe:</p>
                      <p className="text-sm print:text-xs whitespace-pre-line">{drink.recipe}</p>
                    </div>
                  </Card>
                )) : (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No recipes found. Try adjusting your search or filter.
                  </div>
                )}
              </div>

              {/* Print-only header */}
              <style>{`
                @media print {
                  @page { margin: 1cm; }
                  body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                }
              `}</style>
            </Card>
          </TabsContent>

          {/* Users Tab (Owner Only) */}
          <TabsContent value="users">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
                    <Users className="w-6 h-6" /> User Management
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Manage staff users and their roles (Owner only)</p>
                </div>
                <Button onClick={handleCreateUser} data-testid="create-user-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New User
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full" data-testid="users-table">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Created</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Last Login</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? users.map((user, index) => (
                      <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                        <td className="px-4 py-3 text-sm font-medium">{user.name}</td>
                        <td className="px-4 py-3 text-sm">{user.email}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant={user.role === 'owner' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant={user.active ? 'default' : 'destructive'}>
                            {user.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              data-testid={`user-edit-${user.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {user.role !== 'owner' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                data-testid={`user-delete-${user.id}`}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-muted-foreground">
                          No users found. Create your first staff user to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>


          {/* Reviews Management Tab */}
          <TabsContent value="reviews">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
                    ⭐ Review Management
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">AI-powered customer review resolution system</p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {pendingReviews.length} Pending
                </Badge>
              </div>

              {pendingReviews.length === 0 ? (
                <div className="text-center py-12 bg-green-50 rounded-lg">
                  <p className="text-xl font-semibold text-green-800">✓ All reviews resolved!</p>
                  <p className="text-muted-foreground mt-2">No pending customer issues at this time.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingReviews.map((review) => (
                    <Card key={review.review_id} className="p-6 border-2 border-amber-400 bg-amber-50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-lg">{review.customer_name}</h4>
                          <p className="text-sm text-muted-foreground">{review.customer_email}</p>
                          <div className="flex gap-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-2xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="mb-2">{review.business_location}</Badge>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 mb-4">
                        <p className="font-semibold mb-2">Customer Review:</p>
                        <p className="text-muted-foreground">{review.review_text}</p>
                      </div>

                      {review.ai_conversation && review.ai_conversation.length > 0 && (
                        <div className="space-y-3">
                          <p className="font-semibold">AI Conversation:</p>
                          {review.ai_conversation.map((msg, i) => (
                            <div key={i} className={`p-3 rounded-lg ${msg.role === 'ai' ? 'bg-blue-100' : 'bg-white'}`}>
                              <p className="text-xs font-semibold mb-1">
                                {msg.role === 'ai' ? '🤖 AI Assistant' : '👤 Customer'}
                              </p>
                              <p className="text-sm">{msg.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(msg.timestamp).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => window.open(`mailto:${review.customer_email}?subject=Re: Your Review at ${review.business_location}`, '_blank')}
                          className="flex-1"
                        >
                          📧 Email Customer
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(review.customer_email);
                            toast.success('Email copied to clipboard');
                          }}
                          className="flex-1"
                        >
                          📋 Copy Email
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

        </Tabs>
      </div>

      {/* User Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="sm:max-w-md" data-testid="user-modal">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <Label>Email</Label>
              <Input 
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                placeholder="user@eastend.com"
                disabled={editingUser !== null}
                data-testid="user-modal-email"
              />
            </div>

            <div>
              <Label>Name</Label>
              <Input 
                value={userForm.name}
                onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                placeholder="John Doe"
                data-testid="user-modal-name"
              />
            </div>

            <div>
              <Label>Role</Label>
              <Select value={userForm.role} onValueChange={(val) => setUserForm({...userForm, role: val})}>
                <SelectTrigger data-testid="user-modal-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="marketing_associate">Marketing Associate</SelectItem>
                  <SelectItem value="sales_associate">Sales Associate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Password {editingUser && '(leave blank to keep current)'}</Label>
              <Input 
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'}
                data-testid="user-modal-password"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch 
                checked={userForm.active}
                onCheckedChange={(val) => setUserForm({...userForm, active: val})}
                data-testid="user-modal-active"
              />
              <Label>Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserModal(false)}>Cancel</Button>
            <Button onClick={handleSaveUser} data-testid="user-modal-save">
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  <SelectItem value="Dirty Sodas">Dirty Sodas</SelectItem>
                  <SelectItem value="Shakes">Shakes</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
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

      {/* Sunlink Entry Modal */}
      <Dialog open={showSunlinkModal} onOpenChange={(open) => {
        setShowSunlinkModal(open);
        if (!open) {
          setSunlinkStaffName('');
          setSunlinkConfirmed(false);
          setSelectedTanningOrder(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-orange-900">
              ☀️ Mark Order as Entered in Sunlink
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedTanningOrder && (
              <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
                <div className="text-sm font-bold text-orange-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">📋</span> Order Details
                </div>
                <div className="text-sm text-orange-900 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Order #:</span>
                    <span className="font-mono">{selectedTanningOrder.order_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Customer:</span>
                    <span>{selectedTanningOrder.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Phone:</span>
                    <span>{selectedTanningOrder.customer_phone}</span>
                  </div>
                  <div className="h-px bg-orange-300 my-2"></div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Bed:</span>
                    <span className="font-bold text-orange-700">{selectedTanningOrder.level_label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Package:</span>
                    <span className="font-bold text-orange-700">{selectedTanningOrder.package_label}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Amount Paid:</span>
                    <span className="font-bold text-green-600">${selectedTanningOrder.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border">
              <div>
                <label htmlFor="staff-name" className="block text-sm font-bold mb-2 text-gray-900">
                  Your Name: <span className="text-red-500">*</span>
                </label>
                <Input
                  id="staff-name"
                  type="text"
                  value={sunlinkStaffName}
                  onChange={(e) => setSunlinkStaffName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full"
                  data-testid="sunlink-staff-name-input"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be recorded as who processed this order
                </p>
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <Checkbox
                  id="sunlink-confirm"
                  checked={sunlinkConfirmed}
                  onCheckedChange={setSunlinkConfirmed}
                  className="mt-1"
                  data-testid="sunlink-confirm-checkbox"
                />
                <label
                  htmlFor="sunlink-confirm"
                  className="text-sm font-medium leading-tight cursor-pointer"
                >
                  I confirm that I have entered this order into the Sunlink tanning system
                </label>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
              <p className="text-xs text-yellow-900 font-semibold">
                ⚠️ Warning: This action cannot be undone. Only confirm after successfully entering the order in Sunlink.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSunlinkModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleMarkSunlinkEntered}
              disabled={!sunlinkStaffName.trim() || !sunlinkConfirmed}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="sunlink-mark-entered-button"
            >
              ✓ Confirm Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Order Notification Dialog */}
      <Dialog open={!!newOrderNotification} onOpenChange={(open) => !open && setNewOrderNotification(null)}>
        <DialogContent className="max-w-md border-4 border-yellow-400 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {newOrderNotification?.type === 'fizze' ? '🥤 NEW FIZZE ORDER!' : '☀️ NEW TANNING ORDER!'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className={`${newOrderNotification?.type === 'fizze' ? 'bg-teal-50 border-teal-400' : 'bg-orange-50 border-orange-400'} border-2 rounded-lg p-4 animate-pulse`}>
              <div className="text-center mb-3">
                <div className="text-4xl mb-2">{newOrderNotification?.type === 'fizze' ? '🥤' : '☀️'}</div>
                <div className="text-xl font-bold">{newOrderNotification?.orderNumber}</div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">Customer:</span>
                  <span className="font-bold">{newOrderNotification?.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="text-lg font-bold text-green-600">${newOrderNotification?.total?.toFixed(2)}</span>
                </div>
              </div>

              {newOrderNotification?.type === 'fizze' && newOrderNotification?.items?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-teal-300">
                  <div className="font-semibold text-xs mb-2">Items to Prepare:</div>
                  {newOrderNotification.items.map((item, i) => (
                    <div key={i} className="text-xs bg-white rounded px-2 py-1 mb-1">
                      <strong>{item.quantity}x</strong> {item.drink_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center">
              <Button 
                onClick={() => {
                  setNewOrderNotification(null);
                  setActiveTab(newOrderNotification?.type === 'fizze' ? 'fizzeorders' : 'tanningorders');
                }}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg h-12"
              >
                View Order Details →
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
