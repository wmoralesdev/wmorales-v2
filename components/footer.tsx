export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <p className="text-muted-foreground font-medium">
              Built with Next.js & Tailwind CSS
            </p>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-500"></div>
          </div>
          <p className="text-sm text-muted-foreground">
            Copyright © {currentYear} Walter Morales. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 