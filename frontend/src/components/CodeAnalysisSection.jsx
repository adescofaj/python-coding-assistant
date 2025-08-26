// components/CodeAnalysisSection.jsx
import React from 'react';
import { Code } from 'lucide-react';
import CodeEditor from './CodeEditor';
import ActionButtons from './ActionButtons';

const CodeAnalysisSection = ({ 
  code, 
  setCode, 
  onExplain, 
  onDebug, 
  isLoading,
  currentAction
}) => {
  const placeholder = `# Enter your Python code here...
def greet(name):
    print(f'Hello, {name}!')

greet('World')`;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-600" />
            Code Analysis
          </h2>
          <CodeEditor 
            code={code}
            setCode={setCode}
            placeholder={placeholder}
          />
        </div>
        
        <ActionButtons 
          onExplain={onExplain}
          onDebug={onDebug}
          isLoading={isLoading}
          hasCode={code.trim().length > 0}
          currentAction={currentAction}
        />
      </div>
    </div>
  );
};

export default CodeAnalysisSection;