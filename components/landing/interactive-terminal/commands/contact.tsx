export const contactCommand = {
  description: "Get in touch with me",
  category: "profile" as const,
  execute: () => (
    <div className="space-y-3 text-slate-700 dark:text-gray-300">
      <div className="font-semibold text-green-600 dark:text-green-400">Contact Information</div>
      <div className="space-y-2">
        <div>
          Email:{" "}
          <a
            className="text-cyan-600 hover:underline dark:text-cyan-400"
            href="mailto:hello@wmorales.dev"
          >
            hello@wmorales.dev
          </a>
        </div>
        <div className="text-sm text-slate-600 dark:text-gray-400">
          Available for consulting, collaborations, and interesting projects
        </div>
      </div>
    </div>
  ),
};
