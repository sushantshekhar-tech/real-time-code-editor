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
      socketRef.current = await initSocket();
      //if connections fails or user unable to connect
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));
      //function to handle errors

      const handleErrors = (e) => {
        console.log("socket error", e);
        toast.error("Socket connection failed , try again later.");
        reactNavigator("/");
      };

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.userName,
      });

      //Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.userName) {
            toast.success(`${username} joined the room.`);
            // console.log(`${username} joined`);
            setClients(clients);
          }
        }
      );

      //Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    //cleaning function
    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.disconnect();
      }
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen bg-[#1a1c2c] text-gray-300">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141629] p-6 flex flex-col justify-between">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-6">
            {/* Replace with actual logo if you have one */}
            <div className="bg-green-500 p-2 rounded-full mr-2">
              <span className="text-white font-bold">Sushant code Editor</span>
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

      <Editor />
    </div>
  );
};

export default EditorPage;
