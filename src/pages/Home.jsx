import React, { useState } from "react";
import Footer from "./Footer";
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast'
import { useNavigate } from "react-router";

const Home = () => {
  const navigate= useNavigate();
const [roomId,setRoomId]=useState('');
const [userName,setUserName]=useState('');

 const createNewRoom =(e)=>{
e.preventDefault();
const id= uuidV4();
// console.log(id)
setRoomId(id);
toast.success('Created a new room')

 }

 const joinRoom=()=>{
if(!roomId || !userName){
  toast.error('Room Id and username is required')
  return;
}

//redirect
navigate(`/editor/${roomId}`,{
  state:{
    userName,
  },
})
 }

  return (
    <>
   
    <div
      className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
      style={{ backgroundColor: "black" }}
    >
      <div
        className="sm:mx-auto sm:w-full sm:max-w-sm bg-gray-800 bg-opacity-75 p-8 rounded-lg"
      >
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Paste invitation Room Id
        </h2>

        <form action="#" method="POST" className="space-y-6 mt-10">
          <div>
            <label
              htmlFor="roomId"
              className="block text-sm font-medium leading-6 text-white"
            >
              Room ID
            </label>
            <div className="mt-2">
              <input
                id="roomId"
                name="roomId"
                type="text"
                onChange={(e)=>setRoomId(e.target.value)}
                value={roomId}
                required
                autoComplete="off"
                className="block w-full rounded-md border-0 py-1.5 text-white bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-white"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                onChange={(e)=>setUserName(e.target.value)}
                value={userName}
                type="text"
                required
                autoComplete="off"
                className="block w-full rounded-md border-0 py-1.5 text-white bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
            onClick={joinRoom}
              type="submit"
              className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Join
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          If you don't have an invite, create a{" "}
          <a onClick={createNewRoom}
            href=" "
            className="font-semibold leading-6 text-green-500 hover:text-green-400"
          >
            new room
          </a>
        </p>
      </div>
    </div>
    <Footer></Footer>
    </>
  );
};

export default Home;
