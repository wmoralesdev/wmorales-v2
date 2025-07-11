'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';

// Callout component for notes, warnings, etc.
interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const icons = {
    info: <Info className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
    success: <CheckCircle className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />,
  };

  const variants = {
    info: 'default' as const,
    warning: 'destructive' as const,
    success: 'default' as const,
    error: 'destructive' as const,
  };

  return (
    <Alert variant={variants[type]} className="my-4">
      {icons[type]}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}

// CodeBlock component for syntax highlighting
interface CodeBlockProps {
  language?: string;
  content: string;
  filename?: string;
}

export function CodeBlock({ language = 'text', content, filename }: CodeBlockProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <div className="my-4">
      {filename && (
        <div className="bg-zinc-800 text-zinc-300 px-4 py-2 text-sm rounded-t-lg font-mono">
          {filename}
        </div>
      )}
      <pre className={`bg-zinc-900 rounded-${filename ? 'b' : ''}lg overflow-x-auto`}>
        <code className={`language-${language}`}>{content}</code>
      </pre>
    </div>
  );
}

// Export the components object for Markdoc
export const markdocComponents = {
  Callout,
  CodeBlock,
  Image: ({ src, alt, width, height }: any) => (
    <Image
      src={src}
      alt={alt || ''}
      width={width || 800}
      height={height || 400}
      className="rounded-lg my-6"
    />
  ),
  Link: ({ href, children }: any) => {
    const isExternal = href?.startsWith('http');
    return (
      <Link
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="text-purple-400 hover:text-purple-300 underline"
      >
        {children}
      </Link>
    );
  },
  Card: ({ children }: any) => (
    <Card className="my-4">
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  ),
};