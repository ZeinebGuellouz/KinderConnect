import PlaceholderPage from './PlaceholderPage';
import { Users } from 'lucide-react';

export default function Contact() {
  return (
    <PlaceholderPage
      title="Contact Kindergarten"
      description="Get in touch with your kindergarten administration for support, questions, or to obtain your login credentials."
      icon={<Users className="w-8 h-8 text-secondary" />}
    />
  );
}
