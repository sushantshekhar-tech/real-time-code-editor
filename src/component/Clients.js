import React from 'react'
import Avatar from 'react-avatar'

const Clients = ({username}) => {
  return (
    <div className="flex flex-col items-center space-y-2 p-4 shadow-md">
    <Avatar name={username} size={50} round="14px" />
    <span className="text-white font-semibold text-sm">{username}</span>
  </div>
  
  )
}

export default Clients
