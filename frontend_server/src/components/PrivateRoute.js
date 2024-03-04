import { Outlet,Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const PrivateRoute = () => {

  const {isAuthenticated}=useContext(AuthContext);
  const token = Cookies.get('token');

  return (
    isAuthenticated || token ? <Outlet/> : <Navigate to="/login"/>
  );
};

export default PrivateRoute;