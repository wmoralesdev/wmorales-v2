import { CodeBlock } from './code-block';

export function DebugTest() {
  return (
    <div>
      <h2>CodeBlock Test</h2>
      <CodeBlock language="javascript">
        console.log('Hello, World!');
      </CodeBlock>
    </div>
  );
} 