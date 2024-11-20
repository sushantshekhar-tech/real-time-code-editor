import {io} from 'socket.io-client';

//the function that will return client instance for the backend
export const initSocket = async()=>{
    const options = {
        forceNew: true,                 
        reconnectionAttempts: Infinity,  
        timeout: 10000,                  
        transports: ['websocket'],       
      };
    //   console.log(process.env.REACT_APP_BACKEND_URL);
    return io(process.env.REACT_APP_BACKEND_URL,options);
   
};


