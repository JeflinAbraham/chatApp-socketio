import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
    const fun = async () => {
        
    }
    // privateRoute component checks if the currentUser exists or not, if the currentUser exists it renders the Outlet, which in turn renders the matched child routes. If currentUser does not exist (meaning the user is not authenticated), it redirects to the /sign-in route using Navigate.
    const { _id } = useSelector((state) => state.user);
    return _id ? <Outlet /> : <Navigate to='/sign-in' />;
}