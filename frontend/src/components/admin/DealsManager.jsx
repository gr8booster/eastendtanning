import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Plus, Edit, Trash2, Upload, Image, Video, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const DealsManager = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    original_price: '',
    deal_price: '',
    start_date: '',
    end_date: '',
    is_active: true
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/deals/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setDeals(data.deals);
      }
    } catch (error) {
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    const userEmail = localStorage.getItem('adminEmail') || 'admin@eastend.com';

    try {
      const endpoint = editingDeal 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/deals/${editingDeal.deal_id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/deals/create`;
      
      const method = editingDeal ? 'PATCH' : 'POST';
      
      const payload = {
        ...formData,
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        deal_price: parseFloat(formData.deal_price),
        created_by: userEmail
      };

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        // Upload media if selected
        if (selectedFile) {
          const dealId = editingDeal ? editingDeal.deal_id : data.deal_id;
          await uploadMedia(dealId);
        }
        
        toast.success(editingDeal ? 'Deal updated!' : 'Deal created!');
        setShowCreateDialog(false);
        setEditingDeal(null);
        resetForm();
        fetchDeals();
      } else {
        toast.error(data.message || 'Failed to save deal');
      }
    } catch (error) {
      toast.error('Error saving deal');
    }
  };

  const uploadMedia = async (dealId) => {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/deals/${dealId}/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Media uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload media');
    }
  };

  const handleDelete = async (dealId) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;

    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/deals/${dealId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Deal deleted');
        fetchDeals();
      } else {
        toast.error(data.detail || 'Failed to delete deal');
      }
    } catch (error) {
      toast.error('Error deleting deal');
    }
  };

  const openEditDialog = (deal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      description: deal.description,
      original_price: deal.original_price || '',
      deal_price: deal.deal_price,
      start_date: deal.start_date.split('T')[0],
      end_date: deal.end_date.split('T')[0],
      is_active: deal.is_active
    });
    setShowCreateDialog(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      original_price: '',
      deal_price: '',
      start_date: '',
      end_date: '',
      is_active: true
    });
    setSelectedFile(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image or video file');
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  if (loading) {
    return <div className="p-6">Loading deals...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Deal of the Month</h2>
          <p className="text-muted-foreground">Manage special deals displayed on the Tanning page</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingDeal(null); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDeal ? 'Edit Deal' : 'Create New Deal'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Deal Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="50% Off Matrix Beds"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Get 50% off all Matrix tanning bed sessions this month!"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="original_price">Original Price (optional)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                    placeholder="69.99"
                  />
                </div>
                <div>
                  <Label htmlFor="deal_price">Deal Price *</Label>
                  <Input
                    id="deal_price"
                    type="number"
                    step="0.01"
                    value={formData.deal_price}
                    onChange={(e) => setFormData({...formData, deal_price: e.target.value})}
                    placeholder="34.99"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="media">Upload Image or Video (Max 10MB)</Label>
                <div className="mt-2">
                  <input
                    id="media"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90"
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="is_active">Active (visible on website)</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDeal ? 'Update Deal' : 'Create Deal'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {deals.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No deals created yet</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Deal
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {deals.map((deal) => (
            <Card key={deal.deal_id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{deal.title}</h3>
                    {deal.is_active ? (
                      <Badge className="bg-green-500">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4">{deal.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {deal.original_price && (
                      <div>
                        <span className="text-muted-foreground">Original:</span>
                        <p className="font-semibold line-through">${deal.original_price.toFixed(2)}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Deal Price:</span>
                      <p className="font-semibold text-green-600">${deal.deal_price.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Start:</span>
                      <p className="font-semibold">{new Date(deal.start_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">End:</span>
                      <p className="font-semibold">{new Date(deal.end_date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {deal.media_type && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      {deal.media_type === 'image' ? (
                        <><Image className="w-4 h-4" /> Has image</>
                      ) : (
                        <><Video className="w-4 h-4" /> Has video</>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(deal)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(deal.deal_id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
