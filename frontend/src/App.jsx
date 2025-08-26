// App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import CodeAnalysisSection from './components/CodeAnalysisSection';
import ChatSection from './components/ChatSection';
import Footer from './components/Footer';

const App = () => {
  const [code, setCode] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState(null); // Track which action is loading
  const [threadId] = useState(() => `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Real API call function
  const callAPI = async (action, userInput = '') => {
    setIsLoading(true);
    setCurrentAction(action); // Set which action is currently loading
    
    // Add user message for GENERAL chat only (EXPLAIN/DEBUG already added above)
    if (userInput && action === 'GENERAL') {
      setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    }

    try {
      // Prepare request payload
      const payload = {
        action: action,
        thread_id: threadId,
        ...(action === 'GENERAL' 
          ? { message: userInput } 
          : { code: code }
        )
      };

      // Call real API
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }]);
      
    } catch (error) {
      console.error('API Error:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to the AI server. Make sure the backend is running on http://localhost:8000';
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
      setCurrentAction(null); // Clear the current action
    }
  };

  const handleExplain = () => {
    if (!code.trim()) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Please enter some Python code in the code editor above before clicking Explain.' 
      }]);
      return;
    }
    // Add the code as a user message first
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: `Explain this code:\n\n\`\`\`python\n${code}\n\`\`\`` 
    }]);
    callAPI('EXPLAIN');
  };
  
  const handleDebug = () => {
    if (!code.trim()) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Please enter some Python code in the code editor above before clicking Debug.' 
      }]);
      return;
    }
    // Add the code as a user message first
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: `Debug this code:\n\n\`\`\`python\n${code}\n\`\`\`` 
    }]);
    callAPI('DEBUG');
  };
  
  const handleChatSend = () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setInput('');
      callAPI('GENERAL', userMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Code Input Section */}
        <CodeAnalysisSection 
          code={code}
          setCode={setCode}
          onExplain={handleExplain}
          onDebug={handleDebug}
          isLoading={isLoading}
          currentAction={currentAction}
        />

        {/* Chat Section */}
        <ChatSection 
          messages={messages}
          input={input}
          setInput={setInput}
          onSend={handleChatSend}
          isLoading={isLoading}
          currentAction={currentAction}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default App;