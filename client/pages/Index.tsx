import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  Bell, 
  CheckCircle, 
  Heart, 
  Shield, 
  Smartphone,
  Globe,
  ArrowRight,
  Star
} from 'lucide-react';

function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-xl">KinderConnect</h1>
                <p className="text-sm text-muted-foreground">Parents Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/contact">Contact</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/admin">Admin Panel</Link>
              </Button>
              <Button asChild>
                <Link to="/login">Parent Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center space-y-8">
          <div className="space-y-6">
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              <Heart className="w-3 h-3 mr-1" />
              Trusted by families worldwide
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Stay Connected with Your
              <span className="text-primary block">Child's Journey</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              KinderConnect makes it easy for parents to stay involved in their child's kindergarten experience. 
              Track attendance, manage events, and stay updated with real-time notifications.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/login">
                  Access Your Portal
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/contact">Get Credentials</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Everything You Need</h2>
            <p className="text-muted-foreground text-lg">Comprehensive tools for modern parent engagement</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Attendance Tracking */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <CardTitle>Attendance Tracking</CardTitle>
                <CardDescription>
                  Monitor your child's attendance with detailed reports and real-time updates.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Event Management */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Event Management</CardTitle>
                <CardDescription>
                  View upcoming events, claim items to bring, and manage your participation.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Quick Absence Reporting */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle>One-Tap Reporting</CardTitle>
                <CardDescription>
                  Report absences quickly with a single tap. Instant notifications to teachers.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Push Notifications */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-info" />
                </div>
                <CardTitle>Smart Notifications</CardTitle>
                <CardDescription>
                  Receive timely updates about your child's activities and important announcements.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Multilingual Support */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Multilingual News</CardTitle>
                <CardDescription>
                  Access news and updates in your preferred language for better understanding.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Contract Management */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Contract Changes</CardTitle>
                <CardDescription>
                  Request contract modifications with approval workflow and tracking.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 border-y">
          <div className="container mx-auto px-4 py-16 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join thousands of parents who trust KinderConnect to stay connected 
                with their child's educational journey.
              </p>
            </div>
            
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
              ))}
            </div>
            
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/login">
                Access Your Parent Portal
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">KinderConnect</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/contact" className="hover:text-foreground transition-colors">
                Support
              </Link>
              <span>•</span>
              <span>Made with {' '}</span>
              <Heart className="w-3 h-3 fill-red-500 text-red-500" />
              <span>{' '} for families</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;
