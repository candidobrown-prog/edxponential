import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EddyMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-2', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-[#0a0f1e] flex items-center justify-center flex-shrink-0 mt-0.5">
          <MessageCircle className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className={cn(
        'max-w-[82%] rounded-2xl px-4 py-2.5 text-sm',
        isUser
          ? 'bg-[#0a0f1e] text-white rounded-br-sm'
          : 'bg-gray-100 text-[#0a0f1e] rounded-bl-sm'
      )} style={{ fontFamily: 'Arial, sans-serif' }}>
        {isUser ? (
          <p className="leading-relaxed">{message.content}</p>
        ) : (
          <ReactMarkdown
            className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:leading-relaxed [&_strong]:font-black [&_ul]:my-1 [&_li]:my-0.5"
            components={{
              a: ({ children, href }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{children}</a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}