// components/ActionButtons.jsx
import React from 'react';
import { Code, Bug, Loader2 } from 'lucide-react';

const ActionButtons = ({ onExplain, onDebug, isLoading, hasCode, currentAction }) => {
  return (
    <div className="flex gap-3 justify-center">
      <button
        onClick={onExplain}
        disabled={isLoading || !hasCode}
        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg
                 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                 transition-all duration-200 font-medium shadow-lg hover:shadow-xl
                 transform hover:scale-105 disabled:transform-none cursor-pointer"
      >
        <Code className="w-5 h-5" />
        {isLoading && currentAction === 'EXPLAIN' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'Explain Code'
        )}
      </button>
      
      <button
        onClick={onDebug}
        disabled={isLoading || !hasCode}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg
                 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                 transition-all duration-200 font-medium shadow-lg hover:shadow-xl
                 transform hover:scale-105 disabled:transform-none cursor-pointer"
      >
        <Bug className="w-5 h-5" />
        {isLoading && currentAction === 'DEBUG' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'Debug Code'
        )}
      </button>
    </div>
  );
};

export default ActionButtons;