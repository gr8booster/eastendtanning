import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import { Alert, AlertDescription } from '../components/ui/alert';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

export default function SkinTypeEvaluation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    natural_hair_color: '',
    natural_eye_color: '',
    natural_skin_color: '',
    first_exposure_response: '',
    freckles_naturally: false,
    had_three_or_more_sunburns: false,
    worked_outdoors_as_teen: false,
    age_range: '',
    medical_conditions: '',
    medications: '',
    agrees_to_follow_recommendations: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/skin-type/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        toast.success('Skin type evaluation complete!');
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to submit evaluation');
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      toast.error('Failed to submit evaluation');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 mx-auto text-teal-500" />
              <h1 className="text-3xl font-bold text-slate-900">Evaluation Complete</h1>
              <p className="text-slate-600">Thank you, {result.customer_name}!</p>
            </div>

            <Alert className={`${
              result.warning_level === 'high' ? 'border-red-300 bg-red-50' :
              result.warning_level === 'medium' ? 'border-yellow-300 bg-yellow-50' :
              'border-green-300 bg-green-50'
            }`}>
              <AlertTriangle className="h-5 w-5" />
              <AlertDescription>
                <strong>Skin Type {result.skin_type}</strong>
                <p className="mt-2">{result.recommendation}</p>
                <p className="mt-2 font-semibold">Maximum Session Time: {result.max_session_time} minutes</p>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-700">
                <li>Start with the recommended tanning level</li>
                <li>Never exceed your maximum session time</li>
                <li>Wait 24-48 hours between sessions</li>
                <li>Use indoor tanning lotions for best results</li>
                <li>Stay hydrated before and after tanning</li>
              </ol>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => navigate('/tanning')}
                className="flex-1 bg-gradient-to-r from-amber-500 to-teal-500"
              >
                View Tanning Packages
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Back to Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Skin Type Evaluation</h1>
            <p className="text-slate-600">
              Required by Ohio State Cosmetology Board before your first tanning session
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Personal Information</h3>
              
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.customer_email}
                  onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                />
              </div>
            </div>

            {/* Natural Coloring */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Natural Coloring</h3>
              
              <div>
                <Label>Natural Hair Color *</Label>
                <RadioGroup required value={formData.natural_hair_color} onValueChange={(v) => setFormData({...formData, natural_hair_color: v})}>
                  {['Black', 'Dark Brown', 'Brown', 'Lt Brown', 'Blonde', 'Red'].map(color => (
                    <div key={color} className="flex items-center space-x-2">
                      <RadioGroupItem value={color} id={`hair-${color}`} />
                      <Label htmlFor={`hair-${color}`}>{color}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label>Natural Eye Color *</Label>
                <RadioGroup required value={formData.natural_eye_color} onValueChange={(v) => setFormData({...formData, natural_eye_color: v})}>
                  {['Black', 'Dark Brown', 'Brown', 'Lt Brown', 'Blue', 'Green'].map(color => (
                    <div key={color} className="flex items-center space-x-2">
                      <RadioGroupItem value={color} id={`eye-${color}`} />
                      <Label htmlFor={`eye-${color}`}>{color}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label>Natural Skin Color (untanned) *</Label>
                <RadioGroup required value={formData.natural_skin_color} onValueChange={(v) => setFormData({...formData, natural_skin_color: v})}>
                  {['Black', 'Dark Brown', 'Brown', 'Lt Brown', 'Medium', 'Pale'].map(color => (
                    <div key={color} className="flex items-center space-x-2">
                      <RadioGroupItem value={color} id={`skin-${color}`} />
                      <Label htmlFor={`skin-${color}`}>{color}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Tanning Response */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Sun Exposure History</h3>
              
              <div>
                <Label>After 45 minutes of first sun exposure, I typically: *</Label>
                <RadioGroup required value={formData.first_exposure_response} onValueChange={(v) => setFormData({...formData, first_exposure_response: v})}>
                  {[
                    'Burn w/ no tan',
                    'Burn w/ little tan',
                    'Burn then tan',
                    'Tan w/ no burn'
                  ].map(response => (
                    <div key={response} className="flex items-center space-x-2">
                      <RadioGroupItem value={response} id={`response-${response}`} />
                      <Label htmlFor={`response-${response}`}>{response}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Risk Factors</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="freckles"
                  checked={formData.freckles_naturally}
                  onCheckedChange={(checked) => setFormData({...formData, freckles_naturally: checked})}
                />
                <Label htmlFor="freckles">I have freckles naturally</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sunburns"
                  checked={formData.had_three_or_more_sunburns}
                  onCheckedChange={(checked) => setFormData({...formData, had_three_or_more_sunburns: checked})}
                />
                <Label htmlFor="sunburns">I've had 3 or more blistering sunburns</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="outdoors"
                  checked={formData.worked_outdoors_as_teen}
                  onCheckedChange={(checked) => setFormData({...formData, worked_outdoors_as_teen: checked})}
                />
                <Label htmlFor="outdoors">I worked outdoors as a teenager</Label>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <div>
                <Label>Age Range *</Label>
                <RadioGroup required value={formData.age_range} onValueChange={(v) => setFormData({...formData, age_range: v})}>
                  {['18-25', '26-35', '36-45', '46-55', '56+'].map(range => (
                    <div key={range} className="flex items-center space-x-2">
                      <RadioGroupItem value={range} id={`age-${range}`} />
                      <Label htmlFor={`age-${range}`}>{range}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="medical">Medical Conditions (optional)</Label>
                <Input
                  id="medical"
                  value={formData.medical_conditions}
                  onChange={(e) => setFormData({...formData, medical_conditions: e.target.value})}
                  placeholder="e.g., lupus, skin conditions"
                />
              </div>

              <div>
                <Label htmlFor="medications">Current Medications (optional)</Label>
                <Input
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => setFormData({...formData, medications: e.target.value})}
                  placeholder="e.g., antibiotics, acne treatments"
                />
              </div>
            </div>

            {/* Agreement */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agree"
                  required
                  checked={formData.agrees_to_follow_recommendations}
                  onCheckedChange={(checked) => setFormData({...formData, agrees_to_follow_recommendations: checked})}
                />
                <Label htmlFor="agree" className="text-sm leading-relaxed">
                  I agree to follow the tanning recommendations provided based on my skin type evaluation. 
                  I understand the importance of safe tanning practices and session time limits. *
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-teal-500 hover:from-amber-600 hover:to-teal-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : 'Complete Evaluation'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
