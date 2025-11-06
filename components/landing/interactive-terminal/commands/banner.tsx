"use client";

export const bannerCommand = {
  description: "Display ASCII banner",
  usage: "banner",
  category: "fun" as const,
  execute: () => {
    const banner = `
╔══════════════════════════════════════╗
║                                      ║
║   ██╗    ██╗ ███╗   ███╗            ║
║   ██║    ██║ ████╗ ████║            ║
║   ██║ █╗ ██║ ██╔████╔██║            ║
║   ██║███╗██║ ██║╚██╔╝██║            ║
║   ╚███╔███╔╝ ██║ ╚═╝ ██║            ║
║    ╚══╝╚══╝  ╚═╝     ╚═╝            ║
║                                      ║
║   Software Engineer                  ║
║   Cursor Ambassador                  ║
║                                      ║
╚══════════════════════════════════════╝
`.trim();

    return (
      <div className="whitespace-pre font-mono text-green-600 text-xs dark:text-green-400">
        {banner}
      </div>
    );
  },
};
