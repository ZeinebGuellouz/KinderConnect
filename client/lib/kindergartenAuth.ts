// Ultra-simple authentication for kindergarten credentials
// No Firebase, no complexity - just localStorage and simple logic

export interface Child {
  id: string;
  name: string;
  class: string;
  teacher: string;
  age: number;
  photo?: string;
}

interface KindergartenParent {
  parentId: string;
  name: string;
  children: Child[];
}

// Demo parent data (in real app, this would come from kindergarten database)
const DEMO_PARENTS: Record<string, { password: string; data: KindergartenParent }> = {
  'parent123': {
    password: 'demo2024',
    data: {
      parentId: 'parent123',
      name: 'Sarah Johnson',
      children: [
        {
          id: 'child-1',
          name: 'Emma Johnson',
          class: 'Rainbow Class',
          teacher: 'Ms. Anderson',
          age: 4,
          photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
        },
        {
          id: 'child-2',
          name: 'Liam Johnson',
          class: 'Sunshine Class',
          teacher: 'Mr. Wilson',
          age: 5,
          photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam'
        }
      ]
    }
  },
  'PAR001': {
    password: 'kindergarten2024',
    data: {
      parentId: 'PAR001',
      name: 'Michael Smith',
      children: [
        {
          id: 'child-3',
          name: 'Alex Smith',
          class: 'Adventure Class',
          teacher: 'Ms. Brown',
          age: 5,
          photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
        }
      ]
    }
  },
  'PAR002': {
    password: 'family2024',
    data: {
      parentId: 'PAR002',
      name: 'Maria Garcia',
      children: [
        {
          id: 'child-4',
          name: 'Sofia Garcia',
          class: 'Rainbow Class',
          teacher: 'Ms. Anderson',
          age: 4,
          photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia'
        },
        {
          id: 'child-5',
          name: 'Diego Garcia',
          class: 'Explorer Class',
          teacher: 'Ms. Davis',
          age: 3,
          photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego'
        },
        {
          id: 'child-6',
          name: 'Carlos Garcia',
          class: 'Adventure Class',
          teacher: 'Ms. Brown',
          age: 5,
          photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'
        }
      ]
    }
  }
};

export const login = (parentId: string, password: string): { success: boolean; error?: string; parent?: KindergartenParent } => {
  console.log('Attempting login for:', parentId);
  
  const parentRecord = DEMO_PARENTS[parentId];
  
  if (!parentRecord) {
    return { success: false, error: 'Parent ID not found. Please check your credentials.' };
  }
  
  if (parentRecord.password !== password) {
    return { success: false, error: 'Invalid password. Please check your credentials.' };
  }
  
  // Store authentication
  localStorage.setItem('authenticated', 'true');
  localStorage.setItem('currentParent', JSON.stringify(parentRecord.data));
  
  console.log('Login successful for:', parentRecord.data.name);
  
  return { success: true, parent: parentRecord.data };
};

export const logout = (): void => {
  localStorage.removeItem('authenticated');
  localStorage.removeItem('currentParent');
  console.log('Logged out successfully');
};

export const isLoggedIn = (): boolean => {
  const isAuth = localStorage.getItem('authenticated') === 'true';
  console.log('Check if logged in:', isAuth);
  return isAuth;
};

export const getCurrentParent = (): KindergartenParent | null => {
  if (!isLoggedIn()) {
    console.log('Not logged in, returning null');
    return null;
  }
  
  const parentData = localStorage.getItem('currentParent');
  if (!parentData) {
    console.log('No parent data found');
    return null;
  }
  
  try {
    const parent = JSON.parse(parentData);
    console.log('Current parent:', parent.name);
    return parent;
  } catch (error) {
    console.error('Error parsing parent data:', error);
    return null;
  }
};

// Legacy function - now handled by AbsenceCalendar component
export const reportAbsence = (childName: string): void => {
  // Simulate absence reporting
  console.log('Absence reported for:', childName);
  alert(`Absence reported for ${childName}. The kindergarten has been notified.`);
};

// Absence management functions
export const getChildAbsences = async (childId: string) => {
  try {
    const response = await fetch(`/api/absence/child/${childId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching child absences:', error);
    return { success: false, error: 'Failed to fetch absences' };
  }
};

export const createAbsence = async (childId: string, dates: string[], reason?: string) => {
  try {
    const response = await fetch('/api/absence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        childId,
        dates,
        reason,
        isRecurring: false
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating absence:', error);
    return { success: false, error: 'Failed to create absence' };
  }
};

// Event management
export interface KindergartenEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  class: string;
  createdAt: string;
  responses: Record<string, 'accepted' | 'denied' | 'pending'>;
}

export const getEventsForChild = (child: Child): KindergartenEvent[] => {
  const allEvents = localStorage.getItem('kindergartenEvents');
  if (!allEvents) return [];

  try {
    const events: KindergartenEvent[] = JSON.parse(allEvents);

    // Filter events for this child's class or 'All Classes'
    return events.filter(event =>
      event.class === child.class || event.class === 'All Classes'
    ).map(event => {
      // Ensure parent has a response status for this event
      const currentParent = getCurrentParent();
      if (currentParent && !event.responses[currentParent.parentId]) {
        event.responses[currentParent.parentId] = 'pending';
      }
      return event;
    });
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
};

export const respondToEvent = (eventId: string, response: 'accepted' | 'denied'): boolean => {
  const currentParent = getCurrentParent();
  if (!currentParent) return false;

  try {
    const allEvents = localStorage.getItem('kindergartenEvents');
    if (!allEvents) return false;

    const events: KindergartenEvent[] = JSON.parse(allEvents);
    const eventIndex = events.findIndex(event => event.id === eventId);

    if (eventIndex === -1) return false;

    // Update the parent's response
    events[eventIndex].responses[currentParent.parentId] = response;

    // Save back to localStorage
    localStorage.setItem('kindergartenEvents', JSON.stringify(events));

    console.log(`Event ${eventId} response updated to ${response} for parent ${currentParent.parentId}`);
    return true;
  } catch (error) {
    console.error('Error responding to event:', error);
    return false;
  }
};

export const getEventResponse = (eventId: string): 'accepted' | 'denied' | 'pending' => {
  const currentParent = getCurrentParent();
  if (!currentParent) return 'pending';

  try {
    const allEvents = localStorage.getItem('kindergartenEvents');
    if (!allEvents) return 'pending';

    const events: KindergartenEvent[] = JSON.parse(allEvents);
    const event = events.find(e => e.id === eventId);

    return event?.responses[currentParent.parentId] || 'pending';
  } catch (error) {
    console.error('Error getting event response:', error);
    return 'pending';
  }
};

// Child selection for multi-child families
export const getSelectedChildId = (): string | null => {
  return localStorage.getItem('selectedChildId');
};

export const setSelectedChildId = (childId: string): void => {
  localStorage.setItem('selectedChildId', childId);
  console.log('Selected child ID set to:', childId);
};

export const getSelectedChild = (): Child | null => {
  const parent = getCurrentParent();
  if (!parent) return null;

  const selectedChildId = getSelectedChildId();
  if (!selectedChildId) {
    // Default to first child if none selected
    if (parent.children.length > 0) {
      setSelectedChildId(parent.children[0].id);
      return parent.children[0];
    }
    return null;
  }

  const selectedChild = parent.children.find(child => child.id === selectedChildId);
  return selectedChild || parent.children[0] || null;
};
