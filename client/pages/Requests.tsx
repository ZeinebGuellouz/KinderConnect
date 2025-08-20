import PlaceholderPage from './PlaceholderPage';
import { FileText } from 'lucide-react';

export default function Requests() {
  return (
    <PlaceholderPage
      title="Contract Changes"
      description="Request changes to your kindergarten contract. Submit requests that require approval from kindergarten administration."
      icon={<FileText className="w-8 h-8 text-accent" />}
    />
  );
}
