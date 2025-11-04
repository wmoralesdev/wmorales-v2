import type { CommandDefinition } from "../types";

const COMMAND_LIST = [
  { name: "help", description: "Show available commands" },
  { name: "about", description: "Learn more about me" },
  { name: "skills", description: "View my technical skills" },
  { name: "projects", description: "See my recent projects" },
  { name: "experience", description: "View my work experience" },
  { name: "contact", description: "Get in touch with me" },
  { name: "socials", description: "Find me on social media" },
  { name: "resume", description: "Download my resume" },
  { name: "clear", description: "Clear the terminal" },
  { name: "theme", description: "Toggle terminal theme" },
];

export const helpCommand: CommandDefinition = {
  description: "Show available commands",
  execute: () => (
    <div className="space-y-2">
      <div className="text-green-400 font-semibold">Available commands:</div>
      <div className="ml-4 space-y-1.5 text-gray-300">
        {COMMAND_LIST.map((cmd) => (
          <div key={cmd.name}>
            <span className="text-cyan-400">{cmd.name}</span> -{" "}
            {cmd.description}
          </div>
        ))}
      </div>
    </div>
  ),
};
