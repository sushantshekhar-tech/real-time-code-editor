import React, { useState, useRef, useEffect } from "react";
import Clients from "../component/Clients";
import Editor from "../component/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
  const reactNavigator = useNavigate();
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize the socket connection
        socketRef.current = await initSocket();

        // Handle connection errors
        const handleErrors = (err) => {
          console.error("Socket error:", err);
          toast.error("Socket connection failed. Please try again later.");
          reactNavigator("/");
        };

        socketRef.current.on("connect_error", handleErrors);
        socketRef.current.on("connect_failed", handleErrors);

        // Emit JOIN event to the server
        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: location.state?.userName,
        });

        // Listen for the JOINED event
        socketRef.current.on(ACTIONS.JOINED, ({ clients, username }) => {
          if (username !== location.state?.userName) {
            toast.success(`${username} joined the room.`);
          }
          setClients(clients);
        });

        // Listen for the DISCONNECTED event
        socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
          toast.success(`${username} left the room.`);
          setClients((prev) =>
            prev.filter((client) => client.socketId !== socketId)
          );
        });
      } catch (err) {
        console.error("Error initializing socket:", err);
        toast.error("Unable to initialize connection.");
      }
    };

    init();

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.disconnect();
      }
    };
  }, [roomId, location.state, reactNavigator]);

  // Redirect if location state is missing
  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen bg-[#1a1c2c] text-gray-300">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141629] p-6 flex flex-col justify-between">
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center mb-6">
            <div className="bg-green-500 p-2 rounded-full mr-2">
              <span className="text-white font-bold">Sushant Code Editor</span>
            </div>
          </div>

          {/* Connected Clients */}
          <div className="text-sm mb-8 overflow-y-auto flex-grow">
            <h2 className="mb-4">Connected</h2>
            <div className="grid grid-cols-2 gap-4">
              {clients.map(({ socketId, username }) => (
                <Clients key={socketId} username={username} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Buttons */}
        <div className="flex flex-row space-x-4">
          <button
            className="bg-green-700 text-sm py-2 px-3 rounded text-white"
            onClick={() => {
              navigator.clipboard.writeText(roomId);
              toast.success("Room ID copied to clipboard.");
            }}
          >
            Copy ROOM ID
          </button>
          <button
            className="bg-gray-700 text-sm py-2 px-3 rounded text-white"
            onClick={() => reactNavigator("/")}
          >
            Leave
          </button>
        </div>
      </aside>

      {/* Editor Section */}
      <Editor />
    </div>
  );
};

export default EditorPage;
