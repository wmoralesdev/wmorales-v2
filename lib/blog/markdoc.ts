import Markdoc, { nodes as baseNodes } from "@markdoc/markdoc";

// Define custom tags for enhanced components
const tags = {
  callout: {
    render: "Callout",
    description: "Display a callout",
    attributes: {
      type: {
        type: String,
        default: "info",
        matches: ["info", "warning", "error", "success", "tip"],
        description: "The type of callout",
      },
      title: {
        type: String,
        description: "Optional title for the callout",
      },
    },
  },

  card: {
    render: "CardComponent",
    description: "Display a card",
    attributes: {
      title: {
        type: String,
        description: "Optional title for the card",
      },
      description: {
        type: String,
        description: "Optional description for the card",
      },
      variant: {
        type: String,
        default: "default",
        matches: ["default", "feature", "warning", "success"],
        description: "The variant of the card",
      },
    },
  },

  "code-block": {
    render: "CodeBlock",
    description: "Display a code block with syntax highlighting",
    attributes: {
      language: {
        type: String,
        description: "Programming language for syntax highlighting",
      },
      filename: {
        type: String,
        description: "Optional filename to display",
      },
      showLineNumbers: {
        type: Boolean,
        default: false,
        description: "Whether to show line numbers",
      },
      highlight: {
        type: Array,
        description: "Line numbers to highlight",
      },
    },
  },

  video: {
    render: "Video",
    description: "Embed a video",
    attributes: {
      src: {
        type: String,
        required: true,
        description: "Video source URL",
      },
      title: {
        type: String,
        description: "Optional video title",
      },
      poster: {
        type: String,
        description: "Optional poster image URL",
      },
    },
  },

  separator: {
    render: "SeparatorComponent",
    description: "Display a separator line",
    attributes: {
      spacing: {
        type: String,
        default: "normal",
        matches: ["small", "normal", "large"],
        description: "Spacing around the separator",
      },
    },
  },

  "table-of-contents": {
    render: "TableOfContents",
    description: "Display a table of contents",
    attributes: {
      headings: {
        type: Array,
        required: true,
        description: "Array of heading objects with id, title, and level",
      },
    },
  },
};

// Define custom nodes for enhanced functionality
const nodes = {
  ...baseNodes,

  image: {
    ...baseNodes.image,
    render: "ImageComponent",
    attributes: {
      ...baseNodes.image.attributes,
      caption: {
        type: String,
        description: "Optional image caption",
      },
      priority: {
        type: Boolean,
        default: false,
        description: "Whether to prioritize loading this image",
      },
    },
  },

  link: {
    ...baseNodes.link,
    render: "LinkComponent",
    attributes: {
      ...baseNodes.link.attributes,
      showIcon: {
        type: Boolean,
        default: true,
        description: "Whether to show external link icon",
      },
    },
  },

  heading: {
    ...baseNodes.heading,
    render: "Heading",
    attributes: {
      ...baseNodes.heading.attributes,
      id: {
        type: String,
        description: "Optional ID for heading links",
      },
    },
  },

  fence: {
    ...baseNodes.fence,
    render: "CodeBlock",
    attributes: {
      language: {
        type: String,
        description: "Programming language for syntax highlighting",
      },
      filename: {
        type: String,
        description: "Optional filename to display",
      },
    },
  },

  code: {
    ...baseNodes.code,
    render: "CodeBlock",
    attributes: {
      language: {
        type: String,
        description: "Programming language for syntax highlighting",
      },
      filename: {
        type: String,
        description: "Optional filename to display",
      },
    },
  },

  pre: {
    render: "CodeBlock",
  },
};

// Configuration for the Markdoc transformer
const config = {
  tags,
  nodes,
  variables: {
    // Add any global variables here
  },
  functions: {
    // Add any custom functions here
  },
};

export function parseMarkdoc(content: string) {
  const ast = Markdoc.parse(content);
  const errors = Markdoc.validate(ast, config);

  if (errors.length) {
    console.error("Markdoc validation errors:", errors);
    throw new Error(
      `Invalid content: ${errors.map((e) => e.error?.message).join(", ")}`
    );
  }

  const renderable = Markdoc.transform(ast, config);
  return renderable;
}

// Utility function to extract headings from content for table of contents
export function extractHeadings(
  content: string
): Array<{ id: string; title: string; level: number }> {
  const ast = Markdoc.parse(content);
  const headings: Array<{ id: string; title: string; level: number }> = [];

  // biome-ignore lint/suspicious/noExplicitAny: Markdoc AST node types are complex
  function visit(node: any) {
    if (node.type === "heading" && node.attributes?.id) {
      headings.push({
        id: node.attributes.id,
        title:
          // biome-ignore lint/suspicious/noExplicitAny: Markdoc AST child types are complex
          node.children?.map((child: any) => child.content || "").join("") ||
          "",
        level: node.attributes.level,
      });
    }

    if (node.children) {
      node.children.forEach(visit);
    }
  }

  visit(ast);
  return headings;
}

// Utility function to get reading time
export function getReadingTime(content: string): {
  text: string;
  minutes: number;
  words: number;
} {
  // Constants
  const WORDS_PER_MINUTE = 200;

  const plainText = content
    .replace(/[#*`_~[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const words = plainText.split(" ").filter((word) => word.length > 0).length;
  const minutes = Math.ceil(words / WORDS_PER_MINUTE); // Average reading speed

  return {
    text: `${minutes} min read`,
    minutes,
    words,
  };
}

export { config as markdocConfig };
