import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminNotifications } from '@/components/AdminNotifications';
import {
  Calendar,
  Plus,
  Users,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Edit,
  Bell
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  class: string;
  createdAt: string;
  responses: Record<string, 'accepted' | 'denied' | 'pending'>;
}

const KINDERGARTEN_CLASSES = [
  'Rainbow Class',
  'Sunshine Class', 
  'Adventure Class',
  'Explorer Class',
  'All Classes'
];

export default function AdminPanel() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    class: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const storedEvents = localStorage.getItem('kindergartenEvents');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  };

  const saveEvents = (updatedEvents: Event[]) => {
    localStorage.setItem('kindergartenEvents', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.date || !formData.class) {
      setMessage('Please fill in all fields');
      return;
    }

    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      class: formData.class,
      createdAt: new Date().toISOString(),
      responses: {}
    };

    const updatedEvents = [...events, newEvent];
    saveEvents(updatedEvents);
    
    setFormData({ title: '', description: '', date: '', class: '' });
    setShowForm(false);
    setMessage('Event created successfully!');
    
    setTimeout(() => setMessage(''), 3000);
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    saveEvents(updatedEvents);
    setMessage('Event deleted successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const getResponseStats = (event: Event) => {
    const responses = Object.values(event.responses);
    return {
      accepted: responses.filter(r => r === 'accepted').length,
      denied: responses.filter(r => r === 'denied').length,
      pending: responses.filter(r => r === 'pending').length
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Portal
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-xl">KinderConnect Admin</h1>
                  <p className="text-sm text-muted-foreground">Event Management</p>
                </div>
              </div>
            </div>
            
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Success/Error Message */}
        {message && (
          <Alert className="border-success/50 bg-success/10 text-success">
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Admin Tabs */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Events Management
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Absence Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            {/* Create Event Form */}
        {showForm && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Create New Event
              </CardTitle>
              <CardDescription>
                Create an event for a specific class. Parents will be notified and can accept or deny participation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Art Exhibition, Field Trip"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Event Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Target Class</Label>
                  <Select value={formData.class} onValueChange={(value) => setFormData({ ...formData, class: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {KINDERGARTEN_CLASSES.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about the event, what to bring, timing, etc."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Create Event
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Events List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Existing Events</CardTitle>
            <CardDescription>
              Manage events and view parent responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Events Created</h3>
                <p className="text-muted-foreground mb-4">Create your first event to get started</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => {
                  const stats = getResponseStats(event);
                  return (
                    <div key={event.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{event.title}</h3>
                            <Badge variant="outline">{event.class}</Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{event.description}</p>
                          <p className="text-sm text-muted-foreground">
                            Date: {new Date(event.date).toLocaleDateString()} • 
                            Created: {new Date(event.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteEvent(event.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Response Statistics */}
                      <div className="flex gap-4 pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-sm">Accepted: {stats.accepted}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-destructive" />
                          <span className="text-sm">Denied: {stats.denied}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-warning" />
                          <span className="text-sm">Pending: {stats.pending}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <AdminNotifications />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
