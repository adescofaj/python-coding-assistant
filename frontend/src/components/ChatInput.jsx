// components/ChatInput.jsx
import React from 'react';
import { Send, MessageCircle, Loader2 } from 'lucide-react';

const ChatInput = ({ input, setInput, onSend, isLoading, currentAction }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about Python programming..."
          className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   transition-colors duration-200"
          rows={1}
          style={{ minHeight: '44px', maxHeight: '120px' }}
        />
        <MessageCircle className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
      </div>
      <button
        onClick={onSend}
        disabled={isLoading || !input.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                 disabled:bg-gray-400 disabled:cursor-not-allowed
                 transition-all duration-200 shadow-lg hover:shadow-xl
                 transform hover:scale-105 disabled:transform-none"
      >
        {isLoading && currentAction === 'GENERAL' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default ChatInput;