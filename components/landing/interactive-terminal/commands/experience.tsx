export const experienceCommand = {
  description: "View my work experience",
  category: "profile" as const,
  execute: () => (
    <div className="space-y-3">
      <div className="font-semibold text-green-600 dark:text-green-400">Work Experience</div>
      <div className="space-y-3 text-slate-700 dark:text-gray-300">
        <div>
          <span className="font-medium text-cyan-600 dark:text-cyan-400">Cursor Ambassador</span>
          <div className="ml-2 mt-1 text-sm text-slate-600 dark:text-gray-400">2024 - Present</div>
          <div className="ml-2 mt-1 text-sm">
            Promoting AI-powered development practices and helping developers
            adopt AI-assisted coding tools
          </div>
        </div>
        <div>
          <span className="font-medium text-cyan-600 dark:text-cyan-400">
            Senior Software Engineer
          </span>
          <div className="ml-2 mt-1 text-sm text-slate-600 dark:text-gray-400">
            Multiple companies
          </div>
          <div className="ml-2 mt-1 text-sm">
            Leading full-stack development initiatives, architecting scalable
            solutions, and mentoring development teams
          </div>
        </div>
      </div>
    </div>
  ),
};
