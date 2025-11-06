export const skillsCommand = {
  description: "View my technical skills",
  category: "profile" as const,
  execute: () => (
    <div className="space-y-3">
      <div className="font-semibold text-green-600 dark:text-green-400">
        Technical Skills
      </div>
      <div className="grid grid-cols-1 gap-4 text-slate-700 md:grid-cols-2 dark:text-gray-300">
        <div>
          <span className="font-medium text-cyan-600 dark:text-cyan-400">
            Frontend
          </span>
          <div className="mt-1 ml-2 space-y-1 text-sm">
            <div>React, Next.js, TypeScript</div>
            <div>Tailwind CSS, Framer Motion</div>
            <div>shadcn/ui, Radix UI</div>
          </div>
        </div>
        <div>
          <span className="font-medium text-cyan-600 dark:text-cyan-400">
            Backend
          </span>
          <div className="mt-1 ml-2 space-y-1 text-sm">
            <div>Node.js, Python, Go</div>
            <div>PostgreSQL, Redis, Prisma</div>
            <div>Supabase, REST & GraphQL APIs</div>
          </div>
        </div>
        <div>
          <span className="font-medium text-cyan-600 dark:text-cyan-400">
            Cloud & DevOps
          </span>
          <div className="mt-1 ml-2 space-y-1 text-sm">
            <div>AWS, Vercel, Docker</div>
            <div>CI/CD, GitHub Actions</div>
            <div>Monitoring & Observability</div>
          </div>
        </div>
        <div>
          <span className="font-medium text-cyan-600 dark:text-cyan-400">
            AI & Tools
          </span>
          <div className="mt-1 ml-2 space-y-1 text-sm">
            <div>Cursor, OpenAI API</div>
            <div>LangChain, Vector Databases</div>
            <div>AI-powered workflows</div>
          </div>
        </div>
      </div>
    </div>
  ),
};
