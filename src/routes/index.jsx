import { Navigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';

// Sayfa bileşenleri
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword'; // Eklenen bileşen
import Dashboard from '../pages/Dashboard/Dashboard';
import OptikOlusturma from '../pages/Optik/OptikOlusturma';
import OptikFormlarim from '../pages/Optik/OptikFormlarim';
import OptikDetay from '../pages/Optik/OptikDetay';
import NotFound from '../pages/NotFound';

// PrivateRoute bileşeni
const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem('token');
  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  return children;
};

// PublicRoute bileşeni (auth sayfaları için)
const PublicRoute = ({ children, isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

const routes = (isAuthenticated) => [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
      },
      {
        path: 'dashboard',
        element: <PrivateRoute><Dashboard /></PrivateRoute>
      },
      {
        path: 'optik-olustur',
        element: <PrivateRoute><OptikOlusturma /></PrivateRoute>
      },
      {
        path: 'optik-formlarim',
        element: <PrivateRoute><OptikFormlarim /></PrivateRoute>
      },
      {
        path: 'optik/:id',
        element: <PrivateRoute><OptikDetay /></PrivateRoute>
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <PublicRoute isAuthenticated={isAuthenticated}><Login /></PublicRoute>
      },
      {
        path: 'register',
        element: <PublicRoute isAuthenticated={isAuthenticated}><Register /></PublicRoute>
      },
      {
        path: 'forgotpassword',
        element: <PublicRoute isAuthenticated={isAuthenticated}><ForgotPassword /></PublicRoute>
      }
    ]
  }
];

export default routes;