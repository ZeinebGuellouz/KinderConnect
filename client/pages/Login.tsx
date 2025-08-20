import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, isLoggedIn, logout, getCurrentParent } from '@/lib/kindergartenAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Heart, Star } from 'lucide-react';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentParent, setCurrentParent] = useState(getCurrentParent());
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    setCurrentParent(getCurrentParent());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Form submitted with:', credentials.username, credentials.password);

    // Simulate network delay
    setTimeout(() => {
      const result = login(credentials.username, credentials.password);
      
      if (result.success && result.parent) {
        console.log('Login successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        console.log('Login failed:', result.error);
        setError(result.error || 'Login failed');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <Users className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">KinderConnect</h1>
            <p className="text-muted-foreground">Parents Portal</p>
          </div>
        </div>

        {/* Already Logged In Notice */}
        {currentParent && (
          <Card className="border-success/20 bg-success/10">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <h3 className="font-medium text-foreground">Already Logged In</h3>
                <p className="text-sm text-muted-foreground">
                  You are currently logged in as <strong>{currentParent.name}</strong>
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logout();
                      setCurrentParent(null);
                    }}
                    className="flex-1"
                  >
                    Logout
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Login Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-semibold">Welcome Back!</CardTitle>
            <CardDescription>
              Sign in with your pre-issued credentials from your kindergarten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Parent ID / Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your parent ID"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>
              </div>

              {error && (
                <Alert className="border-destructive/50 text-destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-medium"
                disabled={isLoading}
                onClick={(e) => {
                  console.log('Button clicked');
                  // Don't prevent default, let form submission handle it
                }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            
            {/* Quick Demo Login */}
            <Button 
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                console.log('Quick demo login clicked');
                setCredentials({ username: 'parent123', password: 'demo2024' });
                setError('');
                setIsLoading(true);
                
                setTimeout(() => {
                  const result = login('parent123', 'demo2024');
                  if (result.success) {
                    console.log('Quick login successful');
                    navigate('/dashboard');
                  } else {
                    setError(result.error || 'Quick login failed');
                    setIsLoading(false);
                  }
                }, 500);
              }}
              disabled={isLoading}
            >
              🚀 Quick Demo Login
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have credentials?{' '}
                <Link to="/contact" className="text-primary hover:underline font-medium">
                  Contact your kindergarten
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts Info */}
        <Card className="border-accent/20 bg-accent/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center gap-1">
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                <Star className="w-4 h-4 fill-secondary text-secondary" />
              </div>
              <h3 className="font-medium text-foreground">Demo Accounts</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="p-2 bg-background/50 rounded">
                  <p><strong>parent123</strong> / demo2024</p>
                  <p className="text-xs">2 children (Emma & Liam)</p>
                </div>
                <div className="p-2 bg-background/50 rounded">
                  <p><strong>PAR002</strong> / family2024</p>
                  <p className="text-xs">3 children (Sofia, Diego & Carlos)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 fill-red-500 text-red-500" /> for families
          </p>
        </div>
      </div>
    </div>
  );
}
