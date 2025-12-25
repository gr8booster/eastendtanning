import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { CheckCircle2, Clock, MapPin, Phone, Mail, Utensils, Truck, Users, ArrowLeft, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EatsOrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [batchStatus, setBatchStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchOrder();
    fetchBatchStatus();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/eats/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        toast.error('Order not found');
        navigate('/eats');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchStatus = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/eats/orders/current-batch`);
      const data = await response.json();
      setBatchStatus(data);
    } catch (error) {
      console.error('Error fetching batch status:', error);
    }
  };

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.order_number);
    toast.success('Order number copied!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_payment': return 'bg-yellow-500';
      case 'paid': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready_for_pickup': return 'bg-purple-500';
      case 'out_for_delivery': return 'bg-indigo-500';
      case 'delivered': return 'bg-green-600';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--muted))] py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="p-8">
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--muted))] py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Back Link */}
        <Link to="/eats" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Menu
        </Link>

        {/* Success Header */}
        <Card className="p-8 text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2" data-testid="confirmation-title">
            {order.paid ? 'Order Confirmed!' : 'Order Received'}
          </h1>
          <p className="text-muted-foreground mb-4">
            {order.paid 
              ? 'Thank you for your order. We\'ll notify you when delivery is scheduled.'
              : 'Please complete payment to confirm your order.'
            }
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-mono font-bold" data-testid="order-number">{order.order_number}</span>
            <Button variant="ghost" size="sm" onClick={copyOrderNumber} data-testid="copy-order-btn">
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <Badge className={`mt-4 ${getStatusColor(order.status)} text-white`} data-testid="order-status">
            {getStatusLabel(order.status)}
          </Badge>
        </Card>

        {/* Batch Progress */}
        {batchStatus && (
          <Card className="p-6 mb-6 border-2 border-[hsl(var(--secondary))]">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-[hsl(var(--secondary))]" />
              <span className="font-semibold">Weekly Batch Progress</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-[hsl(var(--muted))] rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-[hsl(var(--secondary))] h-full transition-all duration-500"
                  style={{ width: `${Math.min(batchStatus.progress_percentage, 100)}%` }}
                />
              </div>
              <span className="font-bold text-[hsl(var(--secondary))]" data-testid="batch-progress">
                {batchStatus.current_orders}/40
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {batchStatus.status === 'ready_for_fulfillment' 
                ? '🎉 We\'ve reached 40 orders! Delivery will be scheduled soon.'
                : `${40 - batchStatus.current_orders} more orders needed for delivery this week.`
              }
            </p>
          </Card>
        )}

        {/* Order Details */}
        <Card className="p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Utensils className="w-5 h-5" /> Order Details
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[hsl(var(--muted))] rounded-lg">
              <div className="flex-1">
                <p className="font-semibold" data-testid="item-name">{order.menu_item_name}</p>
                <p className="text-sm text-muted-foreground">Quantity: {order.quantity}</p>
              </div>
              <p className="font-bold text-lg">${order.item_price.toFixed(2)}</p>
            </div>

            <div className="space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span>${order.delivery_fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              {order.tip > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Tip</span>
                  <span>${order.tip.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-[hsl(var(--secondary))]" data-testid="order-total">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Delivery Info */}
        <Card className="p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5" /> Delivery Information
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[hsl(var(--muted))] rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium">Delivery Week</p>
                <p className="text-sm text-muted-foreground" data-testid="delivery-week">{order.delivery_week}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[hsl(var(--muted))] rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium">Delivery Address</p>
                <p className="text-sm text-muted-foreground" data-testid="delivery-address">{order.customer_address}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Customer Info */}
        <Card className="p-6">
          <h2 className="font-semibold text-lg mb-4">Your Information</h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span data-testid="customer-phone">{order.customer_phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span data-testid="customer-email">{order.customer_email}</span>
            </div>
            {order.notes && (
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">Notes: {order.notes}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate('/eats')}
            data-testid="order-more-btn"
          >
            Order More
          </Button>
          <Button 
            className="flex-1 bg-[hsl(var(--secondary))] hover:bg-[hsl(183_55%_36%)]"
            onClick={() => {
              const shareText = `I just voted for ${order.menu_item_name} on 818 EATS! Join me and get authentic African cuisine delivered.`;
              if (navigator.share) {
                navigator.share({ title: '818 EATS', text: shareText, url: window.location.origin + '/eats' });
              } else {
                navigator.clipboard.writeText(shareText);
                toast.success('Share message copied!');
              }
            }}
            data-testid="share-btn"
          >
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </div>
    </div>
  );
}
