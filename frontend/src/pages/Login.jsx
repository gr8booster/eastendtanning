import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Target, Lock } from 'lucide-react';

export default function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('admin_token', data.token);
        toast.success('Login successful!');
        navigate('/admin');
      } else {
        toast.error(data.detail || 'Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-teal-50 to-amber-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6" data-testid="login-card">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-teal-500 rounded-full">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-serif bg-gradient-to-r from-amber-600 to-teal-600 bg-clip-text text-transparent">
            Eastend Command Center
          </h1>
          <p className="text-slate-600">
            Admin access required
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                data-testid="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="pl-10"
                required
                autoFocus
              />
            </div>
          </div>

          <Button
            type="submit"
            data-testid="login-button"
            className="w-full bg-gradient-to-r from-amber-500 to-teal-500 hover:from-amber-600 hover:to-teal-600"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Access Dashboard'}
          </Button>
        </form>

        <div className="text-center text-sm text-slate-500">
          <p>Protected by password authentication</p>
        </div>
      </Card>
    </div>
  );
}
