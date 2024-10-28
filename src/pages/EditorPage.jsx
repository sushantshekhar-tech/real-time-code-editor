import React, { useState } from 'react';
import Clients from '../component/Clients';

const EditorPage = () => {
  const [clients, setClients] = useState([
    { socketId: 1, username: 'S shekhar' },
    { socketId: 2, username: 'O Wagisha' },
    { socketId: 3, username: 'B Ghosh' },
    { socketId: 4, username: 'H Kaur' },
    { socketId: 5, username: 'S Iram' },
  ]);

  return (
    <div className="flex min-h-screen bg-[#1a1c2c] text-gray-300">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141629] p-6 flex flex-col justify-between">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-6">
            {/* Replace with actual logo if you have one */}
            <div className="bg-green-500 p-2 rounded-full mr-2">
              <span className="text-white font-bold">Code Sync</span>
            </div>
          </div>
          <div className="text-sm mb-8 overflow-y-auto flex-grow">
            <h2 className="mb-4">Connected</h2>
            {/* Grid layout for two clients per row */}
            <div className="grid grid-cols-2 gap-4">
              {clients.map(({ socketId, username }) => (
                <Clients key={socketId} username={username} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-row space-x-4">
          <button className="bg-green-700 text-sm py-2 px-3 rounded text-white">
            Copy ROOM ID
          </button>
          <button className="bg-gray-700 text-sm py-2 px-3 rounded text-white">
            Leave
          </button>
        </div>
      </aside>

      {/* Editor Section */}
      <main className="flex-grow flex items-center justify-center">
        <textarea
          className="w-full h-full bg-[#1a1c2c] p-4 text-gray-300 outline-none"
          placeholder=""
        ></textarea>
      </main>
    </div>
  );
};

export default EditorPage;
