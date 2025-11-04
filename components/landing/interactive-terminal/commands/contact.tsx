export const contactCommand = {
  description: "Get in touch with me",
  execute: () => (
    <div className="space-y-3 text-gray-300">
      <div className="text-green-400 font-semibold">Contact Information</div>
      <div className="space-y-2">
        <div>
          Email:{" "}
          <a
            className="text-cyan-400 hover:underline"
            href="mailto:hello@wmorales.dev"
          >
            hello@wmorales.dev
          </a>
        </div>
        <div className="text-sm text-gray-400">
          Available for consulting, collaborations, and interesting projects
        </div>
      </div>
    </div>
  ),
};

