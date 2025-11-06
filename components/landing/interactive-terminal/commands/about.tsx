export const aboutCommand = {
  description: "Learn more about me",
  category: "profile" as const,
  execute: () => (
    <div className="space-y-3 text-slate-700 dark:text-gray-300">
      <div className="font-semibold text-green-600 dark:text-green-400">
        About
      </div>
      <div className="space-y-2 text-slate-700 dark:text-gray-300">
        <p>
          Senior Software Engineer and Cursor Ambassador with a passion for
          building innovative solutions using cutting-edge technology.
        </p>
        <p>
          Based in El Salvador, working with global teams to deliver
          high-quality software products and promote AI-powered development
          practices.
        </p>
        <p>
          Specialized in Next.js, React, TypeScript, and modern AI tooling for
          development workflows.
        </p>
      </div>
    </div>
  ),
};
