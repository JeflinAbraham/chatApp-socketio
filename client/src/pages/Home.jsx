import React, { useEffect } from 'react'
import axios from 'axios'
import Sidebar from '@/components/Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { setUser,setOnlineUser } from '@/redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';


function Home() {
  // after sign in, the redux store gets updated with the user info.
  // but when u refresh the home page, the redux store ke states become null.
  // with fetchUserDetails, when u refresh the home page after signing in, the user data must still be available
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('/api/user/user-details');
      console.log(response);
      dispatch(setUser(response.data.userInfo));
    }

    catch (error) {
      console.log(error.response.data.error);
    }
  }
  useEffect(() => {
    fetchUserDetails();
  }, [])


  useEffect(() => {
    // to establish a socket connection using the io function.
    // the io function takes two arguments:
    // 1. The URL of the Socket.io server (http://localhost:3000 in this case).
    // 2. An options object. In this case, the options object has a single property called auth, this auth object has a single property called token, which is sent to the server as part of the socket connection handshake. 
    const socketConnection = io('http://localhost:3000', {
      auth: {
        token: token
      },
    })

    // This listener function is called whenever the server emits an onlineUser event, and it receives the event payload data as a callback() argument which contains the list of online users. 
    socketConnection.on('onlineUser',(data)=>{
      console.log(data);
      dispatch(setOnlineUser(data));
    })

    // The return statement is used to specify a cleanup function that will be called when the component is unmounted. when the component is unmounted, we disconnect the socket connection.
    return () => {
      socketConnection.disconnect()
    }
  }, [])



  return (
    <div className='h-screen'>
      <Sidebar></Sidebar>
    </div>
  )
}

export default Home