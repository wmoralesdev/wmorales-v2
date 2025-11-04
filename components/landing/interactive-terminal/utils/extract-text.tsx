import type { ReactNode } from "react";

/**
 * Recursively extracts all text content from a ReactNode
 * and normalizes whitespace for better typing animation
 */
export function extractText(node: ReactNode): string {
  if (node === null || node === undefined || node === false) {
    return "";
  }

  if (node === true) {
    return "";
  }

  if (typeof node === "string") {
    return node;
  }

  if (typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).filter(Boolean).join(" ");
  }

  if (node && typeof node === "object" && "props" in node) {
    const { children } = node.props || {};
    if (children !== null && children !== undefined) {
      if (Array.isArray(children)) {
        return children.map(extractText).filter(Boolean).join(" ");
      }
      return extractText(children);
    }
  }

  return "";
}

