'use client';

import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { CopyButton } from './copy-button';

type CodeBlockProps = {
  children: string;
  language?: string;
  filename?: string;
};

export function CodeBlock({
  children,
  language = 'javascript',
  filename,
}: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const highlightCode = async () => {
      try {
        setIsLoading(true);

        // Normalize language names
        const normalizedLang = language
          .toLowerCase()
          .replace('js', 'javascript')
          .replace('ts', 'typescript');

        // Use Shiki to highlight the code
        const html = await codeToHtml(children, {
          lang: normalizedLang,
          theme: 'dark-plus', // VS Code dark theme
          transformers: [
            {
              code(node) {
                node.properties.style =
                  'display: block; overflow-x: auto; padding: 0; background: transparent; font-size: 14px; line-height: 1.6; letter-spacing: -0.02em;';
              },
              pre(node) {
                node.properties.style =
                  'background: rgb(30, 30, 30); margin: 0; padding: 1.25rem; border-radius: 0; font-size: 14px; line-height: 1.6;';
              },
            },
          ],
        });

        setHighlightedCode(html);
      } catch {
        // Fallback to plain text with basic styling
        const escapedCode = children
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');

        setHighlightedCode(`
          <pre style="background: rgb(30, 30, 30); margin: 0; padding: 1.25rem; color: rgb(212, 212, 212); font-size: 14px; line-height: 1.6; overflow-x: auto;">
            <code>${escapedCode}</code>
          </pre>
        `);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [children, language]);

  return (
    <div className="group relative my-6">
      {filename && (
        <div className="flex items-center justify-between rounded-t-lg border border-gray-700/50 border-b-0 bg-gray-800 px-4 py-2">
          <span className="font-medium text-gray-300 text-sm">{filename}</span>
          <CopyButton code={children} />
        </div>
      )}
      <div className="relative">
        <div
          className={`
            ${filename ? 'rounded-b-lg border-t-0' : 'rounded-lg'} overflow-hidden border border-gray-700/50 ${isLoading ? 'bg-gray-900' : ''} `}
        >
          {isLoading ? (
            <div className="bg-gray-900 p-5">
              <div className="animate-pulse font-mono text-gray-400 text-sm">
                {children.split('\n').map((_, i) => {
                  // Use deterministic width based on index to avoid hydration mismatch
                  const widths = [
                    95, 85, 90, 75, 88, 92, 80, 95, 70, 85, 88, 95,
                  ];
                  const width = widths[i % widths.length];
                  return (
                    <div
                      className="mb-1 h-5 w-full rounded bg-gray-700"
                      // biome-ignore lint/suspicious/noArrayIndexKey: rendering from markdoc, static
                      key={`skeleton-line-${i}`}
                      style={{ width: `${width}%` }}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              className="[&>pre]:!m-0 [&>pre]:!border-0 [&_*]:!font-mono"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted output from syntax highlighter
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          )}
        </div>
        {!filename && (
          <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
            <CopyButton code={children} />
          </div>
        )}
      </div>
    </div>
  );
}
