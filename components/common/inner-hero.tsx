type InnerHeroProps = {
  title: string;
  description: string;
  icon: React.ElementType;
};

export function InnerHero({ title, description, icon: Icon }: InnerHeroProps) {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(#8b5cf6 1px, transparent 1px), linear-gradient(90deg, #8b5cf6 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="h-full w-full bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <div className="rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3">
              <Icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text font-bold text-5xl text-transparent">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
