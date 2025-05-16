import { Navigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import { useAuth } from '../hooks/useAuth';

// Sayfa bileşenleri
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword'; // Eklenen bileşen
import Dashboard from '../pages/Dashboard/Dashboard';
import OptikOlusturma from '../pages/Optik/OptikOlusturma';
import OptikFormlarim from '../pages/Optik/OptikFormlarim';
import OptikDetay from '../pages/Optik/OptikDetay';
import NotFound from '../pages/NotFound';
import TeacherApprovalsPage from '../pages/TeacherApprovalsPage';
import Profile from '../pages/Profile/Profile';
import Faq from '../pages/Faq';
import Contact from '../pages/Contact';
import ApprovedTeachersPage from '../pages/ApprovedTeachersPage';

// PrivateRoute bileşeni
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // veya bir loading spinner dönebilir
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

// PublicRoute bileşeni (auth sayfaları için)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // veya bir loading spinner dönebilir
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return children;
};

const routes = () => [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
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
      },
      {
        path: 'teacher-approvals',
        element: <PrivateRoute><TeacherApprovalsPage /></PrivateRoute>
      },
      {
        path: 'approved-teachers',
        element: <PrivateRoute><ApprovedTeachersPage /></PrivateRoute>
      },
      {
        path: 'profile',
        element: <PrivateRoute><Profile /></PrivateRoute>
      },
      {
        path: 'faq',
        element: <Faq />
      },
      {
        path: 'contact',
        element: <Contact />
      }
    ]
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <PublicRoute><Login /></PublicRoute>
      },
      {
        path: 'register',
        element: <PublicRoute><Register /></PublicRoute>
      },
      {
        path: 'forgotpassword',
        element: <PublicRoute><ForgotPassword /></PublicRoute>
      }
    ]
  }
];

export default routes;