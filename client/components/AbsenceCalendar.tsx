import { useState, useEffect } from 'react';
import { Calendar, CalendarDays, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Child } from '@/lib/kindergartenAuth';
import { AbsenceRecord } from '@shared/absence';
import { cn } from '@/lib/utils';

interface AbsenceCalendarProps {
  child: Child;
  isOpen: boolean;
  onClose: () => void;
  onAbsenceSubmitted?: () => void;
}

export function AbsenceCalendar({ child, isOpen, onClose, onAbsenceSubmitted }: AbsenceCalendarProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [existingAbsences, setExistingAbsences] = useState<AbsenceRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (isOpen) {
      loadExistingAbsences();
    }
  }, [isOpen, child.id]);

  const loadExistingAbsences = async () => {
    try {
      const response = await fetch(`/api/absence/child/${child.id}`);
      const data = await response.json();

      if (data.success) {
        setExistingAbsences(data.absences || []);
        console.log(`📋 Loaded ${data.absences?.length || 0} existing absences for ${child.name}`);
      } else {
        console.error('Failed to load existing absences:', data.error);
      }
    } catch (error) {
      console.error('Error loading existing absences:', error);
    }
  };

  const resetForm = () => {
    setSelectedDates([]);
    setReason('');
    setMessage('');
  };

  const handleDateClick = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Don't allow past dates
    if (dateStr < today) {
      setMessage('Cannot schedule absences for past dates');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Check if date is already marked as absent
    const isAlreadyAbsent = existingAbsences.some(absence => 
      absence.date === dateStr || (absence.recurringDates && absence.recurringDates.includes(dateStr))
    );

    if (isAlreadyAbsent) {
      setMessage('This date is already marked as absent');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setSelectedDates(prev => 
      prev.includes(dateStr) 
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  const handleSubmit = async () => {
    if (selectedDates.length === 0) {
      setMessage('Please select at least one date');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/absence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: child.id,
          dates: selectedDates,
          reason,
          isRecurring: false
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessage(`✅ Success! ${child.name} is now scheduled as absent for ${selectedDates.length} day${selectedDates.length > 1 ? 's' : ''}. The kindergarten admin has been notified.`);
          // Reload existing absences to update the calendar
          await loadExistingAbsences();
          setTimeout(() => {
            resetForm();
            onClose();
            onAbsenceSubmitted?.();
          }, 3000);
        } else {
          throw new Error(data.error || 'Failed to schedule absences');
        }
      } else {
        throw new Error('Failed to schedule absences');
      }
    } catch (error) {
      console.error('Error submitting absence:', error);
      setMessage('Error scheduling absences. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      const dateStr = current.toISOString().split('T')[0];
      const isCurrentMonth = current.getMonth() === month;
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      const isPast = current < new Date(new Date().toISOString().split('T')[0]);
      const isSelected = selectedDates.includes(dateStr);
      const isAbsent = existingAbsences.some(absence => 
        absence.date === dateStr || (absence.recurringDates && absence.recurringDates.includes(dateStr))
      );

      days.push({
        date: new Date(current),
        dateStr,
        isCurrentMonth,
        isToday,
        isPast,
        isSelected,
        isAbsent
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Schedule Absence for {child.name}
          </DialogTitle>
          <DialogDescription>
            Select the dates when {child.name} will be absent. The kindergarten admin will be automatically notified.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Success/Error Message */}
          {message && (
            <Alert className={message.includes('successfully') ? 'border-success/50 bg-success/10' : 'border-destructive/50 bg-destructive/10'}>
              <AlertDescription className={message.includes('successfully') ? 'text-success' : 'text-destructive'}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          {/* Calendar */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={previousMonth}>
                  ←
                </Button>
                <CardTitle className="text-lg">{monthName}</CardTitle>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  →
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day.dateStr)}
                    disabled={day.isPast || day.isAbsent}
                    className={cn(
                      "p-2 text-sm rounded-md transition-colors relative",
                      !day.isCurrentMonth && "text-muted-foreground/50",
                      day.isCurrentMonth && !day.isPast && !day.isAbsent && "hover:bg-accent",
                      day.isToday && "bg-primary/10 border border-primary/20",
                      day.isSelected && "bg-primary text-primary-foreground",
                      day.isPast && "text-muted-foreground/30 cursor-not-allowed",
                      day.isAbsent && "bg-destructive/10 text-destructive cursor-not-allowed"
                    )}
                  >
                    {day.date.getDate()}
                    {day.isAbsent && (
                      <X className="w-3 h-3 absolute top-0 right-0 text-destructive" />
                    )}
                    {day.isSelected && (
                      <Check className="w-3 h-3 absolute top-0 right-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-destructive/10 border border-destructive/20 rounded"></div>
                  <span>Already Absent</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-muted rounded"></div>
                  <span>Past Date</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Dates Summary */}
          {selectedDates.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Selected Dates ({selectedDates.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedDates.map(date => (
                    <Badge key={date} variant="secondary" className="cursor-pointer" onClick={() => handleDateClick(date)}>
                      {new Date(date).toLocaleDateString()}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="e.g., Family vacation, doctor appointment, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); onClose(); }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || selectedDates.length === 0}
          >
            {submitting ? 'Submitting...' : `Schedule ${selectedDates.length} Absence${selectedDates.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
