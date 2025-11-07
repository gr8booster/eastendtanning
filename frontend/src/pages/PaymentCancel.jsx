import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center space-y-6">
        <XCircle className="w-20 h-20 mx-auto text-orange-500" />
        <h1 className="text-3xl font-bold text-slate-900">Payment Cancelled</h1>
        <p className="text-slate-600">
          Your payment was cancelled. No charges were made to your account.
        </p>
        
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate('/tanning')}
            className="w-full bg-gradient-to-r from-amber-500 to-teal-500"
          >
            View Packages Again
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
