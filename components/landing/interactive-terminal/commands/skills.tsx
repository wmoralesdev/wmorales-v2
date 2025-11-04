export const skillsCommand = {
  description: "View my technical skills",
  execute: () => (
    <div className="space-y-3">
      <div className="text-green-400 font-semibold">Technical Skills</div>
      <div className="grid grid-cols-1 gap-4 text-gray-300 md:grid-cols-2">
        <div>
          <span className="text-cyan-400 font-medium">Frontend</span>
          <div className="mt-1 ml-2 space-y-1 text-sm">
            <div>React, Next.js, TypeScript</div>
            <div>Tailwind CSS, Framer Motion</div>
            <div>shadcn/ui, Radix UI</div>
          </div>
        </div>
        <div>
          <span className="text-cyan-400 font-medium">Backend</span>
          <div className="mt-1 ml-2 space-y-1 text-sm">
            <div>Node.js, Python, Go</div>
            <div>PostgreSQL, Redis, Prisma</div>
            <div>Supabase, REST & GraphQL APIs</div>
          </div>
        </div>
        <div>
          <span className="text-cyan-400 font-medium">Cloud & DevOps</span>
          <div className="mt-1 ml-2 space-y-1 text-sm">
            <div>AWS, Vercel, Docker</div>
            <div>CI/CD, GitHub Actions</div>
            <div>Monitoring & Observability</div>
          </div>
        </div>
        <div>
          <span className="text-cyan-400 font-medium">AI & Tools</span>
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

