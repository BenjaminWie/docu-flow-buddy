
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MarkdownRendererProps {
  content: string;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 rounded bg-gray-800 hover:bg-gray-700 text-white transition-colors"
      title="Copy code"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose prose-gray max-w-none">
      <ReactMarkdown
        components={{
          // Enhanced code blocks with syntax highlighting and copy button
          code(props) {
            const { children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            const codeContent = String(children).replace(/\n$/, '');
            
            return match ? (
              <div className="relative">
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg"
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                  }}
                  {...rest}
                >
                  {codeContent}
                </SyntaxHighlighter>
                <CopyButton text={codeContent} />
              </div>
            ) : (
              <code
                className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono"
                {...rest}
              >
                {children}
              </code>
            );
          },
          
          // Enhanced tables with proper styling
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300 bg-white rounded-lg">
                  {children}
                </table>
              </div>
            );
          },
          
          thead({ children }) {
            return (
              <thead className="bg-gray-50">
                {children}
              </thead>
            );
          },
          
          th({ children }) {
            return (
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">
                {children}
              </th>
            );
          },
          
          td({ children }) {
            return (
              <td className="border border-gray-300 px-4 py-2 text-gray-700">
                {children}
              </td>
            );
          },
          
          // Enhanced blockquotes for diagrams and special content
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 my-4 italic text-blue-900">
                {children}
              </blockquote>
            );
          },
          
          // Better heading styles
          h1({ children }) {
            return (
              <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4 border-b border-gray-200 pb-2">
                {children}
              </h1>
            );
          },
          
          h2({ children }) {
            return (
              <h2 className="text-xl font-semibold text-gray-900 mt-5 mb-3">
                {children}
              </h2>
            );
          },
          
          h3({ children }) {
            return (
              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                {children}
              </h3>
            );
          },
          
          // Enhanced lists
          ul({ children }) {
            return (
              <ul className="list-disc list-inside space-y-1 my-3 ml-4">
                {children}
              </ul>
            );
          },
          
          ol({ children }) {
            return (
              <ol className="list-decimal list-inside space-y-1 my-3 ml-4">
                {children}
              </ol>
            );
          },
          
          li({ children }) {
            return (
              <li className="text-gray-700 leading-relaxed">
                {children}
              </li>
            );
          },
          
          // Better paragraph spacing
          p({ children }) {
            return (
              <p className="text-gray-700 leading-relaxed my-3">
                {children}
              </p>
            );
          },
          
          // Enhanced links
          a({ href, children }) {
            return (
              <a
                href={href}
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
          
          // Strong and emphasis
          strong({ children }) {
            return (
              <strong className="font-semibold text-gray-900">
                {children}
              </strong>
            );
          },
          
          em({ children }) {
            return (
              <em className="italic text-gray-800">
                {children}
              </em>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
