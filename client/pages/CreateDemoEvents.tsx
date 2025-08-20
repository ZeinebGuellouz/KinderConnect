import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateDemoEvents() {
  const [created, setCreated] = useState(false);

  const createDemoEvents = () => {
    const demoEvents = [
      {
        id: 'event-1704153600000',
        title: 'Spring Art Exhibition',
        description: 'Children will showcase their artwork from this semester. Parents are invited to view the exhibition and participate in creative activities.',
        date: '2024-02-15',
        class: 'Rainbow Class',
        createdAt: new Date().toISOString(),
        responses: {}
      },
      {
        id: 'event-1704240000000',
        title: 'Zoo Field Trip',
        description: 'Educational trip to the city zoo. Children will learn about different animals and their habitats. Lunch will be provided.',
        date: '2024-02-22',
        class: 'All Classes',
        createdAt: new Date().toISOString(),
        responses: {}
      },
      {
        id: 'event-1704326400000',
        title: 'Parent-Teacher Conference',
        description: 'Individual meetings with teachers to discuss your child\'s progress, development, and any concerns.',
        date: '2024-03-05',
        class: 'Sunshine Class',
        createdAt: new Date().toISOString(),
        responses: {}
      },
      {
        id: 'event-1704412800000',
        title: 'Science Fair',
        description: 'Children will present simple science experiments and demonstrations. Come see what they\'ve been learning!',
        date: '2024-03-12',
        class: 'Adventure Class',
        createdAt: new Date().toISOString(),
        responses: {}
      },
      {
        id: 'event-1704499200000',
        title: 'Easter Celebration',
        description: 'Easter egg hunt and spring celebration with snacks and games. Children can bring stuffed animals.',
        date: '2024-03-28',
        class: 'All Classes',
        createdAt: new Date().toISOString(),
        responses: {}
      },
      {
        id: 'event-1704585600000',
        title: 'Music Performance',
        description: 'Children will perform songs and musical pieces they\'ve been practicing. Family and friends are welcome.',
        date: '2024-04-10',
        class: 'Rainbow Class',
        createdAt: new Date().toISOString(),
        responses: {}
      }
    ];

    localStorage.setItem('kindergartenEvents', JSON.stringify(demoEvents));
    setCreated(true);
  };

  const clearEvents = () => {
    localStorage.removeItem('kindergartenEvents');
    setCreated(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Demo Events Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {!created ? (
            <>
              <p className="text-muted-foreground">
                Create demo events to test the Events page functionality.
              </p>
              <Button onClick={createDemoEvents} className="w-full">
                Create Demo Events
              </Button>
            </>
          ) : (
            <>
              <p className="text-success">
                ✅ Demo events created successfully!
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link to="/login">Go to Login</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/admin">View in Admin Panel</Link>
                </Button>
                <Button onClick={clearEvents} variant="destructive" className="w-full">
                  Clear Events
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
