export const socialsCommand = {
  description: "Find me on social media",
  category: "profile" as const,
  execute: () => (
    <div className="space-y-3 text-slate-700 dark:text-gray-300">
      <div className="font-semibold text-green-600 dark:text-green-400">Social Links</div>
      <div className="space-y-2">
        <div>
          GitHub:{" "}
          <a
            className="text-cyan-600 hover:underline dark:text-cyan-400"
            href="https://github.com/wmoralesdev"
            rel="noopener noreferrer"
            target="_blank"
          >
            github.com/wmoralesdev
          </a>
        </div>
        <div>
          LinkedIn:{" "}
          <a
            className="text-cyan-600 hover:underline dark:text-cyan-400"
            href="https://linkedin.com/in/wmoralesdev"
            rel="noopener noreferrer"
            target="_blank"
          >
            linkedin.com/in/wmoralesdev
          </a>
        </div>
        <div>
          Twitter:{" "}
          <a
            className="text-cyan-600 hover:underline dark:text-cyan-400"
            href="https://twitter.com/wmoralesdev"
            rel="noopener noreferrer"
            target="_blank"
          >
            @wmoralesdev
          </a>
        </div>
      </div>
    </div>
  ),
};
