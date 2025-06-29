export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Copyright © {currentYear} Walter Morales. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 