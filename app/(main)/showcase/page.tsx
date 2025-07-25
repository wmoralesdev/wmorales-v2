import { Code2 } from 'lucide-react';
import { InnerHero } from '@/components/common/inner-hero';
import { ShowcaseContent } from '@/components/showcase/showcase-content';

export { metadata } from './metadata';

export default function ShowcasePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <InnerHero
        description="A collection of projects showcasing my journey in software development"
        icon={Code2}
        title="Project Showcase"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16 pt-16">
        <ShowcaseContent />
      </div>
    </div>
  );
}