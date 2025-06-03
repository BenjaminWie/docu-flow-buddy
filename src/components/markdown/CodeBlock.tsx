
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from './CopyButton';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

const CodeBlock = ({ children, className }: CodeBlockProps) => {
  const match = /language-(\w+)/.exec(className || '');
  const codeContent = String(children).replace(/\n$/, '');
  
  if (match) {
    return (
      <div className="relative">
        <SyntaxHighlighter
          language={match[1]}
          style={oneDark as any}
          PreTag="div"
          className="rounded-lg"
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
          }}
        >
          {codeContent}
        </SyntaxHighlighter>
        <CopyButton text={codeContent} />
      </div>
    );
  }

  return (
    <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
      {children}
    </code>
  );
};

export default CodeBlock;
