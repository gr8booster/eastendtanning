import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking');
  const [paymentData, setPaymentData] = useState(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      checkPaymentStatus();
    } else {
      setStatus('error');
      toast.error('Invalid payment session');
    }
  }, [sessionId]);

  const checkPaymentStatus = async () => {
    let attempts = 0;
    const maxAttempts = 5;

    const poll = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/payments/checkout/status/${sessionId}`
        );
        const data = await response.json();

        if (data.payment_status === 'paid') {
          setStatus('success');
          setPaymentData(data);
          toast.success('Payment successful!');
          return;
        } else if (data.status === 'expired') {
          setStatus('error');
          toast.error('Payment session expired');
          return;
        }

        // Continue polling
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setStatus('timeout');
          toast.error('Payment verification timed out. Please contact support.');
        }
      } catch (error) {
        console.error('Error checking payment:', error);
        setStatus('error');
        toast.error('Failed to verify payment');
      }
    };

    poll();
  };

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center space-y-4">
          <Loader2 className="w-16 h-16 mx-auto animate-spin text-teal-500" />
          <h2 className="text-2xl font-bold">Verifying Payment...</h2>
          <p className="text-slate-600">Please wait while we confirm your purchase.</p>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center space-y-6">
          <CheckCircle2 className="w-20 h-20 mx-auto text-green-500" />
          <h1 className="text-3xl font-bold text-slate-900">Payment Successful!</h1>
          <p className="text-slate-600">
            Your tanning package has been activated. You can now book your appointments!
          </p>
          
          {paymentData?.metadata && (
            <div className="bg-slate-50 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm text-slate-600">
                <strong>Package:</strong> {paymentData.metadata.level_name}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Type:</strong> {paymentData.metadata.package_type?.replace('_', ' ')}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Amount:</strong> ${(paymentData.amount_total / 100).toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate('/tanning')}
              className="w-full bg-gradient-to-r from-amber-500 to-teal-500"
            >
              Book Your First Session
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">✕</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Payment {status === 'timeout' ? 'Verification Timeout' : 'Failed'}</h1>
        <p className="text-slate-600">
          {status === 'timeout' 
            ? 'We are still processing your payment. Please check your email or contact support.'
            : 'Something went wrong with your payment. Please try again or contact support.'}
        </p>
        
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate('/tanning')}
            className="w-full bg-gradient-to-r from-amber-500 to-teal-500"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
