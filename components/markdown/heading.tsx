import type { JSX } from "react";

type HeadingProps = {
  children: React.ReactNode;
  id?: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
};

export function Heading({ children, id, level }: HeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Component className="group relative scroll-mt-20" id={id}>
      {children}
      {id && (
        <a
          className="-left-6 absolute top-0 opacity-0 transition-opacity group-hover:opacity-100 scroll-smooth"
          href={`#${id}`}
        >
          <span className="text-gray-400 hover:text-white">#</span>
        </a>
      )}
    </Component>
  );
}

// Individual heading components for easier use
export function H1({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <Heading id={id} level={1}>
      {children}
    </Heading>
  );
}

export function H2({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <Heading id={id} level={2}>
      {children}
    </Heading>
  );
}

export function H3({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <Heading id={id} level={3}>
      {children}
    </Heading>
  );
}

export function H4({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <Heading id={id} level={4}>
      {children}
    </Heading>
  );
}

export function H5({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <Heading id={id} level={5}>
      {children}
    </Heading>
  );
}

export function H6({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <Heading id={id} level={6}>
      {children}
    </Heading>
  );
}
