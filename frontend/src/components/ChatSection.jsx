// components/ChatSection.jsx
import React, { useRef, useEffect } from 'react';
import { MessageCircle, Bot } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatSection = ({ messages, input, setInput, onSend, isLoading, currentAction }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          Python Programming Chat
        </h2>
        <p className="text-sm text-gray-600 mt-1">Ask questions, get help, and learn Python!</p>
      </div>
      
      <div className="h-80 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Hello! I'm your Python AI Assistant</p>
            <p className="text-sm mt-2">
              Enter your Python code above and use the action buttons, or ask me questions here!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage 
              key={index} 
              message={msg.content} 
              isUser={msg.role === 'user'} 
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-white">
        <ChatInput 
          input={input}
          setInput={setInput}
          onSend={onSend}
          isLoading={isLoading}
          currentAction={currentAction}
        />
      </div>
    </div>
  );
};

export default ChatSection;