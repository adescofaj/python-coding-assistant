// components/CodeEditor.jsx
import React from 'react';
import { Code } from 'lucide-react';
import AceEditor from 'react-ace';

// Import the Python mode and theme
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

const CodeEditor = ({ code, setCode, placeholder }) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Python Code
      </label>
      <div className="relative border border-gray-300 rounded-lg overflow-hidden">
        <AceEditor
          mode="python"
          theme="github"
          value={code}
          onChange={setCode}
          placeholder={placeholder}
          fontSize={14}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          width="100%"
          height="256px"
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 4,
            useWorker: false, // Prevents some console warnings
            wrap: true,
            autoScrollEditorIntoView: true,
            minLines: 10,
            maxLines: 20
          }}
          editorProps={{
            $blockScrolling: true
          }}
          style={{
            fontFamily: '"Fira Code", "Monaco", "Consolas", "Ubuntu Mono", monospace'
          }}
        />
        <div className="absolute top-3 right-3 bg-white/80 rounded p-1">
          <Code className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;