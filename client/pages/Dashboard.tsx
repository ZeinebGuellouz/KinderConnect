import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentParent, logout, isLoggedIn, getSelectedChild, setSelectedChildId, Child, getEventsForChild, respondToEvent, getEventResponse, KindergartenEvent } from '@/lib/kindergartenAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { AbsenceCalendar } from '@/components/AbsenceCalendar';
import { AttendanceStats } from '@shared/attendance';
import {
  Calendar,
  CheckCircle,
  Clock,
  Users,
  Bell,
  Settings,
  LogOut,
  Baby,
  CalendarDays,
  AlertCircle,
  Gift,
  MessageSquare,
  FileText
} from 'lucide-react';

interface ParentData {
  parentId: string;
  name: string;
  children: Child[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [parentData, setParentData] = useState<ParentData | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [childEvents, setChildEvents] = useState<KindergartenEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAbsenceCalendar, setShowAbsenceCalendar] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  useEffect(() => {
    console.log('Dashboard useEffect called');

    const authStatus = isLoggedIn();
    console.log('Is logged in:', authStatus);

    if (!authStatus) {
      console.log('Not logged in, redirecting to login');
      navigate('/login');
      return;
    }

    const parentData = getCurrentParent();
    console.log('Parent data:', parentData);

    if (parentData) {
      setParentData(parentData);
      console.log('Parent data set successfully');

      // Get or set selected child
      const currentChild = getSelectedChild();
      if (currentChild) {
        setSelectedChild(currentChild);
        // Load events for this child
        const events = getEventsForChild(currentChild);
        setChildEvents(events);
        // Load attendance stats
        loadAttendanceStats(currentChild);
        console.log('Selected child:', currentChild.name, 'Events:', events.length);
      } else if (parentData.children.length > 0) {
        // Default to first child if none selected
        setSelectedChildId(parentData.children[0].id);
        setSelectedChild(parentData.children[0]);
        const events = getEventsForChild(parentData.children[0]);
        setChildEvents(events);
        // Load attendance stats
        loadAttendanceStats(parentData.children[0]);
        console.log('Defaulted to first child:', parentData.children[0].name, 'Events:', events.length);
      }
    } else {
      console.log('No parent data found, redirecting to login');
      navigate('/login');
      return;
    }

    setLoading(false);
    console.log('Loading set to false');
  }, [navigate]);

  const handleLogout = () => {
    console.log('Logging out');
    logout();
    navigate('/login');
  };

  const handleReportAbsence = () => {
    setShowAbsenceCalendar(true);
  };

  const loadAttendanceStats = async (child: Child) => {
    setLoadingAttendance(true);
    try {
      const response = await fetch(`/api/attendance/child/${child.id}`);
      const data = await response.json();

      if (data.success) {
        setAttendanceStats(data.stats);
        console.log(`📊 Loaded attendance for ${child.name}:`, data.stats);
      } else {
        console.error('Failed to load attendance:', data.error);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const handleAbsenceSubmitted = () => {
    // Refresh attendance data when absence is submitted
    if (selectedChild) {
      loadAttendanceStats(selectedChild);
    }
    console.log('Absence submitted for', selectedChild?.name);
  };

  const handleChildSelect = (child: Child) => {
    setSelectedChildId(child.id);
    setSelectedChild(child);
    // Load events for the newly selected child
    const events = getEventsForChild(child);
    setChildEvents(events);
    // Load attendance stats for the newly selected child
    loadAttendanceStats(child);
    console.log('Child selected:', child.name, 'Events:', events.length);
  };

  const handleEventResponse = (eventId: string, response: 'accepted' | 'denied') => {
    const success = respondToEvent(eventId, response);
    if (success) {
      // Refresh events to show updated status
      if (selectedChild) {
        const updatedEvents = getEventsForChild(selectedChild);
        setChildEvents(updatedEvents);
      }
      const action = response === 'accepted' ? 'accepted' : 'declined';
      alert(`Event ${action} successfully!`);
    } else {
      alert('Failed to update event response. Please try again.');
    }
  };

  if (loading || !parentData || !selectedChild) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const child = selectedChild; // Currently selected child
  
  // Using real events from admin panel instead of hardcoded ones

  const recentNews = [
    { id: 1, title: 'New Playground Equipment Installed', date: '2024-01-20', language: 'English' },
    { id: 2, title: 'Reminder: Bring Lunch Box Daily', date: '2024-01-18', language: 'English' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-xl">KinderConnect</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {parentData.name}</p>
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
        {/* Child Selector (show only if multiple children) */}
        {parentData.children.length > 1 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-center">Select Child</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {parentData.children.map((childOption) => (
                  <button
                    key={childOption.id}
                    onClick={() => handleChildSelect(childOption)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedChild?.id === childOption.id
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={childOption.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${childOption.name}`} />
                        <AvatarFallback className="bg-child-blue text-white font-bold">
                          {childOption.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="font-semibold text-sm">{childOption.name}</h3>
                        <p className="text-xs text-muted-foreground">{childOption.class}</p>
                        <p className="text-xs text-muted-foreground">Age {childOption.age}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Child Info Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/10 to-accent/10">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                <AvatarImage src={child.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${child.name}`} />
                <AvatarFallback className="bg-child-blue text-white text-lg font-bold">
                  {child.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">{child.name}</h2>
                <p className="text-muted-foreground">{child.class} • Age {child.age}</p>
                <p className="text-sm text-muted-foreground">Teacher: {child.teacher}</p>
                {parentData.children.length > 1 && (
                  <Badge variant="outline" className="mt-2">
                    Selected Child
                  </Badge>
                )}
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                <CheckCircle className="w-3 h-3 mr-1" />
                Present Today
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={handleReportAbsence}
            className="h-20 bg-primary hover:bg-primary/90 flex-col gap-2"
          >
            <CalendarDays className="w-6 h-6" />
            Schedule Absence
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" asChild>
            <Link to="/events">
              <Calendar className="w-6 h-6" />
              View Events
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" asChild>
            <Link to="/news">
              <MessageSquare className="w-6 h-6" />
              News & Updates
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" asChild>
            <Link to="/requests">
              <FileText className="w-6 h-6" />
              Contract Changes
            </Link>
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-success" />
                Attendance
              </CardTitle>
              <CardDescription>This month's attendance record</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingAttendance ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading attendance...</p>
                </div>
              ) : attendanceStats ? (
                <>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success">{attendanceStats.attendancePercentage}%</div>
                    <p className="text-sm text-muted-foreground">Present this month</p>
                  </div>
                  <Progress value={attendanceStats.attendancePercentage} className="h-3" />
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold text-success">{attendanceStats.presentDays}</div>
                      <div className="text-muted-foreground">Present</div>
                    </div>
                    <div>
                      <div className="font-semibold text-destructive">{attendanceStats.absentDays}</div>
                      <div className="text-muted-foreground">Absent</div>
                    </div>
                    <div>
                      <div className="font-semibold text-warning">{attendanceStats.lateDays}</div>
                      <div className="text-muted-foreground">Late</div>
                    </div>
                  </div>
                  <div className="text-xs text-center text-muted-foreground">
                    Based on {attendanceStats.totalDays} working days in {new Date(attendanceStats.year, attendanceStats.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No attendance data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Class Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Class Events
              </CardTitle>
              <CardDescription>
                Events for {child.class}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {childEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No events scheduled for {child.class}</p>
                </div>
              ) : (
                childEvents.map((event) => {
                  const userResponse = getEventResponse(event.id);
                  return (
                    <div key={event.id} className="p-4 rounded-lg border bg-card space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Date: {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={userResponse === 'accepted' ? 'default' : userResponse === 'denied' ? 'destructive' : 'secondary'}
                          className="ml-2"
                        >
                          {userResponse === 'accepted' ? 'Accepted' : userResponse === 'denied' ? 'Declined' : 'Pending'}
                        </Badge>
                      </div>

                      {userResponse === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleEventResponse(event.id, 'accepted')}
                            className="flex-1"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleEventResponse(event.id, 'denied')}
                            className="flex-1"
                          >
                            Decline
                          </Button>
                        </div>
                      )}

                      {userResponse !== 'pending' && (
                        <div className="pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEventResponse(event.id, userResponse === 'accepted' ? 'denied' : 'accepted')}
                            className="w-full"
                          >
                            Change to {userResponse === 'accepted' ? 'Decline' : 'Accept'}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div className="pt-2">
                <p className="text-xs text-muted-foreground text-center">
                  Events are managed by kindergarten staff
                </p>
              </div>
            </CardContent>
          </Card>

          {/* News & Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-info" />
                Recent News
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentNews.map((news) => (
                <div key={news.id} className="p-3 rounded-lg bg-muted/50">
                  <h4 className="font-medium text-sm">{news.title}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-muted-foreground">{news.date}</p>
                    <Badge variant="secondary" className="text-xs">{news.language}</Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/news">View All News</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Absence Calendar Dialog */}
      {selectedChild && (
        <AbsenceCalendar
          child={selectedChild}
          isOpen={showAbsenceCalendar}
          onClose={() => setShowAbsenceCalendar(false)}
          onAbsenceSubmitted={handleAbsenceSubmitted}
        />
      )}
    </div>
  );
}
