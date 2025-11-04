export const socialsCommand = {
  description: "Find me on social media",
  execute: () => (
    <div className="space-y-3 text-gray-300">
      <div className="text-green-400 font-semibold">Social Links</div>
      <div className="space-y-2">
        <div>
          GitHub:{" "}
          <a
            className="text-cyan-400 hover:underline"
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
            className="text-cyan-400 hover:underline"
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
            className="text-cyan-400 hover:underline"
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

