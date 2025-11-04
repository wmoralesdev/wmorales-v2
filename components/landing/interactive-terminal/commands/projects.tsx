export const projectsCommand = {
  description: "See my recent projects",
  execute: () => (
    <div className="space-y-3">
      <div className="text-green-400 font-semibold">Recent Projects</div>
      <div className="space-y-3 text-gray-300">
        <div>
          <span className="text-cyan-400 font-medium">Portfolio Website</span>
          <div className="ml-2 mt-1 text-sm text-gray-400">
            Personal portfolio featuring interactive terminal, blog system, and
            event management platform
          </div>
        </div>
        <div>
          <span className="text-cyan-400 font-medium">Event Management Platform</span>
          <div className="ml-2 mt-1 text-sm text-gray-400">
            Real-time photo sharing system with QR code integration for live events
          </div>
        </div>
        <div>
          <span className="text-cyan-400 font-medium">AI-Powered Development Tools</span>
          <div className="ml-2 mt-1 text-sm text-gray-400">
            Custom integrations and workflows leveraging AI for enhanced productivity
          </div>
        </div>
      </div>
    </div>
  ),
};

