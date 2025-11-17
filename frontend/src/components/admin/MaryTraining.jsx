import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Upload, FileText, Image, Video, MessageSquare, Archive, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const MaryTraining = () => {
  const [updates, setUpdates] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'product_info',
    priority: 'normal',
    tags: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    fetchUpdates();
    fetchSummary();
  }, []);

  const fetchUpdates = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/mary/training/updates/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUpdates(data.updates);
      }
    } catch (error) {
      toast.error('Failed to load training updates');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/mary/training/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Failed to load summary');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const userEmail = localStorage.getItem('adminEmail') || 'admin@eastend.com';

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        created_by: userEmail
      };

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/mary/training/updates/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        // Upload attachments if any
        if (selectedFiles.length > 0) {
          await uploadAttachments(data.update_id);
        }
        
        toast.success('Training update created!');
        setShowCreateDialog(false);
        resetForm();
        fetchUpdates();
        fetchSummary();
      } else {
        toast.error(data.message || 'Failed to create update');
      }
    } catch (error) {
      toast.error('Error creating update');
    }
  };

  const uploadAttachments = async (updateId) => {
    const token = localStorage.getItem('adminToken');
    
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/mary/training/updates/${updateId}/attachment`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      } catch (error) {
        console.error('Failed to upload attachment:', file.name);
      }
    }
  };

  const handleAddNote = async (updateId) => {
    if (!noteText.trim()) return;

    const token = localStorage.getItem('adminToken');
    const userEmail = localStorage.getItem('adminEmail') || 'admin@eastend.com';

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/mary/training/updates/${updateId}/note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          update_id: updateId,
          note: noteText,
          created_by: userEmail
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Note added');
        setNoteText('');
        fetchUpdates();
      }
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const handleStatusChange = async (updateId, newStatus) => {
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/mary/training/updates/${updateId}/status?status=${newStatus}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Status updated');
        fetchUpdates();
        fetchSummary();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'product_info',
      priority: 'normal',
      tags: ''
    });
    setSelectedFiles([]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    // Validate file sizes
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });
    setSelectedFiles([...selectedFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const getCategoryColor = (category) => {
    const colors = {
      product_info: 'bg-blue-500',
      policy: 'bg-purple-500',
      procedure: 'bg-green-500',
      customer_service: 'bg-orange-500',
      other: 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-500',
      normal: 'bg-blue-500',
      low: 'bg-gray-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  if (loading) {
    return <div className="p-6">Loading training updates...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">AI Mary Updates</h2>
          <p className="text-muted-foreground">Training updates, notes, and information for Mary AI</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              New Update
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Training Update</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="New Lotion Product Information"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Detailed information for Mary to learn..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product_info">Product Info</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="customer_service">Customer Service</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(val) => setFormData({...formData, priority: val})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="lotion, sunless, price"
                />
              </div>

              <div>
                <Label htmlFor="files">Attach Files (Max 10MB each)</Label>
                <div className="mt-2">
                  <input
                    id="files"
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90"
                  />
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                          <span>{file.name}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Update
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Updates</p>
                <p className="text-2xl font-bold">{summary.total_updates}</p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Updates</p>
                <p className="text-2xl font-bold text-green-600">{summary.active_updates}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{Object.keys(summary.categories || {}).length}</p>
              </div>
              <Archive className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
        </div>
      )}

      {updates.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No training updates yet</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Update
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {updates.map((update) => (
            <Card key={update.update_id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{update.title}</h3>
                    <Badge className={getCategoryColor(update.category)}>
                      {update.category.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(update.priority)}>
                      {update.priority}
                    </Badge>
                    <Badge variant={update.status === 'active' ? 'default' : 'secondary'}>
                      {update.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{update.content}</p>
                  
                  {update.tags && update.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {update.tags.map((tag, i) => (
                        <Badge key={i} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  )}

                  {update.attachments && update.attachments.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Upload className="w-4 h-4" />
                      {update.attachments.length} attachment(s)
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Created by {update.created_by} on {new Date(update.created_at).toLocaleDateString()}
                  </p>
                </div>

                <Select value={update.status} onValueChange={(val) => handleStatusChange(update.update_id, val)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes Section */}
              {update.notes && update.notes.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Notes ({update.notes.length})
                  </h4>
                  <div className="space-y-2">
                    {update.notes.map((note) => (
                      <div key={note.note_id} className="bg-muted p-3 rounded text-sm">
                        <p>{note.note}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {note.created_by} • {new Date(note.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Note */}
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Add a note..."
                  value={selectedUpdate === update.update_id ? noteText : ''}
                  onFocus={() => setSelectedUpdate(update.update_id)}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddNote(update.update_id)}
                />
                <Button onClick={() => handleAddNote(update.update_id)}>
                  Add Note
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
