
import ReactMarkdown from 'react-markdown';
import CodeBlock from './markdown/CodeBlock';
import { Table, TableHead, TableHeader, TableCell } from './markdown/TableComponents';
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  Paragraph, 
  UnorderedList, 
  OrderedList, 
  ListItem, 
  Blockquote, 
  Link, 
  Strong, 
  Emphasis 
} from './markdown/TextComponents';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose prose-gray max-w-none">
      <ReactMarkdown
        components={{
          code: CodeBlock,
          table: Table,
          thead: TableHead,
          th: TableHeader,
          td: TableCell,
          blockquote: Blockquote,
          h1: Heading1,
          h2: Heading2,
          h3: Heading3,
          ul: UnorderedList,
          ol: OrderedList,
          li: ListItem,
          p: Paragraph,
          a: Link,
          strong: Strong,
          em: Emphasis,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
