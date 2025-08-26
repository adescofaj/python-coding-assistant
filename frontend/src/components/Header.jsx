// components/Header.jsx
import React from 'react';
import { Bot } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 px-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Bot className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Python AI Assistant</h1>
          <p className="text-blue-100 text-sm">Your intelligent Python programming companion</p>
        </div>
      </div>
    </header>
  );
};

export default Header;