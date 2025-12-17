import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Switch } from '../components/ui/switch';
import { Edit, Trash2, Plus, LogOut, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function VendorPortal() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showLogin, setShowLogin] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: '',
    available: true,
    prep_time_minutes: 60
  });
  const [editingItem, setEditingItem] = useState(null);
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/eats/vendors/login?email=${loginData.email}&password=${loginData.password}`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.status === 'success') {
        setVendor(data.vendor);
        setShowLogin(false);
        fetchVendorMenu(data.vendor.id);
        toast.success(`Welcome back, ${data.vendor.business_name}!`);
      } else {
        toast.error(data.detail || 'Login failed');
      }
    } catch (error) {
      toast.error('Login failed');
    }
  };

  const fetchVendorMenu = async (vendorId) => {
    try {
      const response = await fetch(`${backendUrl}/api/eats/vendors/${vendorId}/menu`);
      const data = await response.json();
      setMenuItems(data.menu || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/eats/vendors/${vendor.id}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      const data = await response.json();
      if (data.status === 'success') {
        toast.success('Menu item added!');
        setShowAddItem(false);
        setNewItem({
          name: '',
          description: '',
          price: 0,
          category: '',
          image_url: '',
          available: true,
          prep_time_minutes: 60
        });
        fetchVendorMenu(vendor.id);
      }
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  const handleUpdateItem = async (itemId) => {
    try {
      const response = await fetch(`${backendUrl}/api/eats/vendors/${vendor.id}/menu/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      if (response.ok) {
        toast.success('Item updated!');
        setEditingItem(null);
        fetchVendorMenu(vendor.id);
      }
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Delete this item?')) return;
    try {
      const response = await fetch(`${backendUrl}/api/eats/vendors/${vendor.id}/menu/${itemId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success('Item deleted');
        fetchVendorMenu(vendor.id);
      }
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const response = await fetch(`${backendUrl}/api/eats/vendors/${vendor.id}/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...item, available: !item.available})
      });
      if (response.ok) {
        toast.success(`Item marked as ${!item.available ? 'available' : 'unavailable'}`);
        fetchVendorMenu(vendor.id);
      }
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const handleLogout = () => {
    setVendor(null);
    setShowLogin(true);
    setMenuItems([]);
    toast.info('Logged out');
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <h1 className="font-serif text-3xl font-bold text-center mb-6">Vendor Portal</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">Login</Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/eats')}
            >
              Back to 818 EATS
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-serif text-3xl font-bold">{vendor?.business_name}</h1>
              <p className="text-white/90">{vendor?.cuisine_type}</p>
            </div>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-3xl font-bold">{menuItems.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-3xl font-bold">{menuItems.filter(i => i.available).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Votes</p>
                <p className="text-3xl font-bold">{menuItems.reduce((sum, i) => sum + (i.votes || 0), 0)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Menu Management */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl font-bold">Your Menu</h2>
            <Button onClick={() => setShowAddItem(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    {item.votes > 0 && (
                      <Badge variant="secondary">
                        👍 {item.votes}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-bold text-orange-600">${item.price.toFixed(2)}</span>
                    <Badge variant={item.available ? 'default' : 'secondary'} className={item.available ? 'bg-green-500' : ''}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`toggle-${item.id}`} className="text-sm">Available</Label>
                      <Switch 
                        id={`toggle-${item.id}`}
                        checked={item.available}
                        onCheckedChange={() => handleToggleAvailability(item)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {menuItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No menu items yet</p>
              <Button onClick={() => setShowAddItem(true)}>
                Add Your First Item
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Add Item Modal */}
      <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <Label htmlFor="item_name">Item Name *</Label>
              <Input 
                id="item_name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="item_description">Description *</Label>
              <Textarea 
                id="item_description"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                rows={3}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="item_price">Price ($) *</Label>
                <Input 
                  id="item_price"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="item_prep_time">Prep Time (minutes)</Label>
                <Input 
                  id="item_prep_time"
                  type="number"
                  value={newItem.prep_time_minutes}
                  onChange={(e) => setNewItem({...newItem, prep_time_minutes: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="item_category">Category</Label>
              <Input 
                id="item_category"
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                placeholder="e.g., Main Course, Appetizer, Dessert"
              />
            </div>

            <div>
              <Label htmlFor="item_image">Image URL</Label>
              <Input 
                id="item_image"
                value={newItem.image_url}
                onChange={(e) => setNewItem({...newItem, image_url: e.target.value})}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch 
                checked={newItem.available}
                onCheckedChange={(checked) => setNewItem({...newItem, available: checked})}
              />
              <Label>Mark as available immediately</Label>
            </div>

            <Button type="submit" className="w-full" size="lg">Add Item</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Item Modal */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateItem(editingItem.id); }} className="space-y-4">
              <div>
                <Label htmlFor="edit_name">Item Name *</Label>
                <Input 
                  id="edit_name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit_description">Description *</Label>
                <Textarea 
                  id="edit_description"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  rows={3}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_price">Price ($) *</Label>
                  <Input 
                    id="edit_price"
                    type="number"
                    step="0.01"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_prep_time">Prep Time (minutes)</Label>
                  <Input 
                    id="edit_prep_time"
                    type="number"
                    value={editingItem.prep_time_minutes}
                    onChange={(e) => setEditingItem({...editingItem, prep_time_minutes: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit_category">Category</Label>
                <Input 
                  id="edit_category"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="edit_image">Image URL</Label>
                <Input 
                  id="edit_image"
                  value={editingItem.image_url}
                  onChange={(e) => setEditingItem({...editingItem, image_url: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch 
                  checked={editingItem.available}
                  onCheckedChange={(checked) => setEditingItem({...editingItem, available: checked})}
                />
                <Label>Available</Label>
              </div>

              <Button type="submit" className="w-full" size="lg">Update Item</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
