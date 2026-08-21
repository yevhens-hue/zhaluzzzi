'use client';

import React from 'react';
import { CheckCircle2, PhoneCall, Ruler, Sparkles } from 'lucide-react';

export interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isLeadSubmitted?: boolean;
}

interface MessageBubbleProps {
  message: MessageItem;
  onQuickAction?: (text: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onQuickAction,
}) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-xs leading-relaxed transition-all ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-xs'
            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-xs'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {/* Lead submission confirmation card */}
        {message.isLeadSubmitted && (
          <div className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Заявку успішно передано черговому майстру!</span>
          </div>
        )}
      </div>
      <span className="text-[10px] text-gray-400 mt-1 px-1">{message.timestamp}</span>
    </div>
  );
};
