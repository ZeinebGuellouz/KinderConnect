import PlaceholderPage from './PlaceholderPage';
import { MessageSquare } from 'lucide-react';

export default function News() {
  return (
    <PlaceholderPage
      title="News & Updates"
      description="Stay updated with multilingual news, notifications, and important announcements from your kindergarten."
      icon={<MessageSquare className="w-8 h-8 text-info" />}
    />
  );
}
