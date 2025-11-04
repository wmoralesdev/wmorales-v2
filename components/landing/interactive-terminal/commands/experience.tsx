export const experienceCommand = {
  description: "View my work experience",
  execute: () => (
    <div className="space-y-3">
      <div className="text-green-400 font-semibold">Work Experience</div>
      <div className="space-y-3 text-gray-300">
        <div>
          <span className="text-cyan-400 font-medium">Cursor Ambassador</span>
          <div className="ml-2 mt-1 text-sm text-gray-400">2024 - Present</div>
          <div className="ml-2 mt-1 text-sm">
            Promoting AI-powered development practices and helping developers adopt
            AI-assisted coding tools
          </div>
        </div>
        <div>
          <span className="text-cyan-400 font-medium">Senior Software Engineer</span>
          <div className="ml-2 mt-1 text-sm text-gray-400">Multiple companies</div>
          <div className="ml-2 mt-1 text-sm">
            Leading full-stack development initiatives, architecting scalable
            solutions, and mentoring development teams
          </div>
        </div>
      </div>
    </div>
  ),
};

