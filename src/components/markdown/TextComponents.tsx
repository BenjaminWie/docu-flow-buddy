
import { ReactNode } from 'react';

export const Heading1 = ({ children }: { children: ReactNode }) => (
  <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4 border-b border-gray-200 pb-2">
    {children}
  </h1>
);

export const Heading2 = ({ children }: { children: ReactNode }) => (
  <h2 className="text-xl font-semibold text-gray-900 mt-5 mb-3">
    {children}
  </h2>
);

export const Heading3 = ({ children }: { children: ReactNode }) => (
  <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
    {children}
  </h3>
);

export const Paragraph = ({ children }: { children: ReactNode }) => (
  <p className="text-gray-700 leading-relaxed my-3">
    {children}
  </p>
);

export const UnorderedList = ({ children }: { children: ReactNode }) => (
  <ul className="list-disc list-inside space-y-1 my-3 ml-4">
    {children}
  </ul>
);

export const OrderedList = ({ children }: { children: ReactNode }) => (
  <ol className="list-decimal list-inside space-y-1 my-3 ml-4">
    {children}
  </ol>
);

export const ListItem = ({ children }: { children: ReactNode }) => (
  <li className="text-gray-700 leading-relaxed">
    {children}
  </li>
);

export const Blockquote = ({ children }: { children: ReactNode }) => (
  <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 my-4 italic text-blue-900">
    {children}
  </blockquote>
);

export const Link = ({ href, children }: { href?: string; children: ReactNode }) => (
  <a
    href={href}
    className="text-blue-600 hover:text-blue-800 underline"
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

export const Strong = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-gray-900">
    {children}
  </strong>
);

export const Emphasis = ({ children }: { children: ReactNode }) => (
  <em className="italic text-gray-800">
    {children}
  </em>
);
