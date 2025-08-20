import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isLoggedIn, getCurrentParent, logout, getEventsForChild, respondToEvent, getEventResponse, Child } from '@/lib/kindergartenAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  ArrowLeft, 
  Users, 
  Bell, 
  Settings, 
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  CalendarDays
} from 'lucide-react';

interface EventWithChild {
  event: any;
  childName: string;
  childClass: string;
  userResponse: 'accepted' | 'denied' | 'pending';
}

export default function Events() {
  const navigate = useNavigate();
  const [parentData, setParentData] = useState<any>(null);
  const [allEvents, setAllEvents] = useState<EventWithChild[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithChild[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    const userData = getCurrentParent();
    if (userData) {
      setParentData(userData);
      loadAllEvents(userData);
    } else {
      navigate('/login');
      return;
    }
    
    setLoading(false);
  }, [navigate]);

  const loadAllEvents = (parent: any) => {
    const eventsWithChildren: EventWithChild[] = [];
    
    // Get events for all children
    parent.children.forEach((child: Child) => {
      const childEvents = getEventsForChild(child);
      childEvents.forEach(event => {
        eventsWithChildren.push({
          event,
          childName: child.name,
          childClass: child.class,
          userResponse: getEventResponse(event.id)
        });
      });
    });

    // Sort by event date (newest first)
    eventsWithChildren.sort((a, b) => new Date(b.event.date).getTime() - new Date(a.event.date).getTime());
    
    setAllEvents(eventsWithChildren);
    setFilteredEvents(eventsWithChildren);
  };

  const handleEventResponse = (eventId: string, response: 'accepted' | 'denied') => {
    const success = respondToEvent(eventId, response);
    if (success) {
      // Refresh events
      if (parentData) {
        loadAllEvents(parentData);
      }
      const action = response === 'accepted' ? 'accepted' : 'declined';
      alert(`Event ${action} successfully!`);
    } else {
      alert('Failed to update event response. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...allEvents];

    // Class filter
    if (classFilter !== 'all') {
      filtered = filtered.filter(item => item.childClass === classFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.userResponse === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(item => {
        const eventDate = new Date(item.event.date);
        
        switch (dateFilter) {
          case 'upcoming':
            return eventDate >= today;
          case 'past':
            return eventDate < today;
          case 'this-month':
            return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredEvents(filtered);
  }, [allEvents, classFilter, statusFilter, searchTerm, dateFilter]);

  if (loading || !parentData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  const getUniqueClasses = () => {
    const classes = new Set(parentData.children.map((child: Child) => child.class));
    return Array.from(classes);
  };

  const getEventStats = () => {
    return {
      total: allEvents.length,
      accepted: allEvents.filter(e => e.userResponse === 'accepted').length,
      denied: allEvents.filter(e => e.userResponse === 'denied').length,
      pending: allEvents.filter(e => e.userResponse === 'pending').length
    };
  };

  const stats = getEventStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-xl">Events & Activities</h1>
                  <p className="text-sm text-muted-foreground">Welcome back, {parentData.name}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Event Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="text-2xl font-bold text-success">{stats.accepted}</p>
                  <p className="text-sm text-muted-foreground">Accepted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-destructive">{stats.denied}</p>
                  <p className="text-sm text-muted-foreground">Declined</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {getUniqueClasses().map(className => (
                      <SelectItem key={className} value={className}>{className}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="denied">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Date</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past Events</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>
              All Events ({filteredEvents.length})
            </CardTitle>
            <CardDescription>
              Complete view of events for all your children
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Events Found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or check back later for new events.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((item, index) => {
                  const isUpcoming = new Date(item.event.date) >= new Date();
                  
                  return (
                    <div key={`${item.event.id}-${index}`} className="border rounded-lg p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{item.event.title}</h3>
                            <Badge variant="outline">{item.event.class}</Badge>
                            <Badge variant={isUpcoming ? 'default' : 'secondary'}>
                              {isUpcoming ? 'Upcoming' : 'Past'}
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground mb-3">{item.event.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>📅 {new Date(item.event.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                            <span>👶 For: {item.childName}</span>
                            <span>🏫 Class: {item.childClass}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge 
                            variant={item.userResponse === 'accepted' ? 'default' : item.userResponse === 'denied' ? 'destructive' : 'secondary'}
                            className="mb-2"
                          >
                            {item.userResponse === 'accepted' ? 'Accepted' : item.userResponse === 'denied' ? 'Declined' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2 border-t">
                        {item.userResponse === 'pending' ? (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleEventResponse(item.event.id, 'accepted')}
                              className="flex-1"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleEventResponse(item.event.id, 'denied')}
                              className="flex-1"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Decline
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEventResponse(item.event.id, item.userResponse === 'accepted' ? 'denied' : 'accepted')}
                            className="w-full"
                          >
                            Change to {item.userResponse === 'accepted' ? 'Decline' : 'Accept'}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
