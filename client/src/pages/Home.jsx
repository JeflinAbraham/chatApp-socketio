import React, { useEffect } from 'react'
import axios from 'axios'
import Sidebar from '@/components/Sidebar'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/userSlice';


function Home() {
  // after sign in, the redux store gets updated with the user info.
  // but when u refresh the home page, the redux store ke states become null.
  // with fetchUserDetails, when u refresh the home page after signing in, the user data must still be available
  const dispatch = useDispatch();
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('/api/user/user-details');
      console.log(response);
      dispatch(setUser(response.data.userInfo));
      
    } 
    catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchUserDetails();
  },[])



  return (
    <div className='h-screen'>
    <Sidebar></Sidebar>
    </div>
  )
}

export default Home