// components/ChatMessage.jsx
import React from 'react';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatMessage = ({ message, isUser }) => {
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-4xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                        ${isUser ? 'bg-blue-600' : 'bg-purple-600'}`}>
          {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
        </div>
        <div className={`p-4 rounded-lg shadow-sm ${
          isUser 
            ? 'bg-blue-600 text-white rounded-br-sm' 
            : 'bg-white border border-gray-200 rounded-bl-sm'
        }`}>
          {isUser ? (
            // User messages - simple text with pre-wrap
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {message}
            </pre>
          ) : (
            // AI messages - render markdown with syntax highlighting
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneLight}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={`bg-gray-100 px-1 py-0.5 rounded text-sm ${className}`} {...props}>
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => <p className="mb-2 text-sm leading-relaxed text-gray-800">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 text-sm">{children}</ul>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                }}
              >
                {message}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;