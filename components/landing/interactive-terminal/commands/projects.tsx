export const projectsCommand = {
  description: "See my recent projects",
  category: "profile" as const,
  execute: () => (
    <div className="space-y-3">
      <div className="font-semibold text-green-600 dark:text-green-400">
        Recent Projects
      </div>
      <div className="space-y-3 text-slate-700 dark:text-gray-300">
        <div>
          <span className="font-medium text-cyan-600 dark:text-cyan-400">
            Portfolio Website
          </span>
          <div className="mt-1 ml-2 text-slate-600 text-sm dark:text-gray-400">
            Personal portfolio featuring interactive terminal, blog system, and
            event management platform
          </div>
        </div>
        <div>
          <span className="font-medium text-cyan-600 dark:text-cyan-400">
            Event Management Platform
          </span>
          <div className="mt-1 ml-2 text-slate-600 text-sm dark:text-gray-400">
            Real-time photo sharing system with QR code integration for live
            events
          </div>
        </div>
        <div>
          <span className="font-medium text-cyan-600 dark:text-cyan-400">
            AI-Powered Development Tools
          </span>
          <div className="mt-1 ml-2 text-slate-600 text-sm dark:text-gray-400">
            Custom integrations and workflows leveraging AI for enhanced
            productivity
          </div>
        </div>
      </div>
    </div>
  ),
};
