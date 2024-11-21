import { useEffect, useRef, useState } from 'react';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { defaultKeymap } from '@codemirror/commands';

const Editor = () => {




  const editorRef = useRef(null);
  const [output, setOutput] = useState(''); // State to hold terminal output

  useEffect(() => {
    const startState = EditorState.create({
      doc: '', // Initial code content
      extensions: [
        lineNumbers(),             // Show line numbers
        javascript(),              // Enable JavaScript syntax highlighting
        oneDark,                   // Apply the One Dark theme
        keymap.of(defaultKeymap)   // Basic key bindings (e.g., Ctrl+Z for undo)
      ]
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current
    });

    return () => view.destroy(); // Cleanup on unmount
  }, []);

  // Function to evaluate code from the editor
  const runCode = () => {
    let capturedOutput = ''; // Variable to capture console output
    const log = console.log; // Reference the original console.log
  
    // Override console.log to capture output
    console.log = (message) => {
      capturedOutput += message + '\n';
    };
  
    try {
      const code = editorRef.current.querySelector('.cm-content').innerText;
      const result = Function('"use strict";' + code)();
      setOutput(capturedOutput || (result !== undefined ? result.toString() : 'No output'));
    } catch (error) {
      setOutput(error.toString());
    } finally {
      console.log = log; // Restore the original console.log
    }


    editorRef.current.on('change',(instance,changes)=>{
      console.log('changes',changes)
    })
  };

  return (
    <div className="editor-container">
      <main className="flex-grow w-full flex items-center justify-center">
        <div ref={editorRef} className="w-full h-full bg-[#1a1c2c] p-4 text-gray-300"></div>
      </main>
      <button onClick={runCode} className="run-button mt-4 ml-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition">Run Code</button>
      <div className="terminal-output bg-black text-green-500 p-4 mt-4">
        <h2>Output:</h2>
        <pre>{output}</pre> {/* Display output in a terminal-like style */}
      </div>
    </div>
  );
};

export default Editor;
