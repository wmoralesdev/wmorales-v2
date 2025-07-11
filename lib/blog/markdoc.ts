import Markdoc from '@markdoc/markdoc';

export function parseMarkdoc(content: string) {
  const ast = Markdoc.parse(content);
  const errors = Markdoc.validate(ast);

  if (errors.length) {
    console.error('Markdoc validation errors:', errors);
    throw new Error('Invalid content');
  }

  const renderable = Markdoc.transform(ast);
  return renderable;
}