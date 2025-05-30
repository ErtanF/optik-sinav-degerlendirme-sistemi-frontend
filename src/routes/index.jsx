import { Navigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import LandingLayout from '../components/layouts/LandingLayout';
import { useAuth } from '../hooks/useAuth';

// Sayfa bileşenleri
import Landing from '../pages/Landing/Landing';
import LandingContact from '../pages/Landing/Contact';
import LandingFAQ from '../pages/Landing/FAQ';
import LandingHakkimizda from '../pages/Landing/Hakkimizda';
import LandingGizlilikPolitikasi from '../pages/Landing/GizlilikPolitikasi';
import LandingKullanimSartlari from '../pages/Landing/KullanimSartlari';
import LandingKVKK from '../pages/Landing/KVKK';
import LandingCerezler from '../pages/Landing/Cerezler';
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
import { StudentsList, StudentForm, ExcelImport } from '../pages/Students';
import { ClassesList, ClassForm, ClassExcelImport, ClassDetail, AddStudentsToClass } from '../pages/Classes';
// Okul yönetimi sayfaları
import { SchoolsList, SchoolForm, AdminForm } from '../pages/Schools';
// Kurumsal sayfalar
import { Hakkimizda, Kariyer, GizlilikPolitikasi, KullanimSartlari } from '../pages/Kurumsal';

// PrivateRoute bileşeni
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // veya bir loading spinner dönebilir
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return children;
};

// PublicRoute bileşeni (auth sayfaları için)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // veya bir loading spinner dönebilir
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

// SuperAdminRoute bileşeni (sadece süperadmin için)
const SuperAdminRoute = ({ children }) => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  if (currentUser?.role !== 'superadmin') {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

// LandingRoute bileşeni (giriş yapmamış kullanıcılar için)
const LandingRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

const routes = () => [
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      {
        path: '/',
        element: <LandingRoute><Landing /></LandingRoute>
      },
      {
        path: 'contact',
        element: <LandingRoute><LandingContact /></LandingRoute>
      },
      {
        path: 'faq',
        element: <LandingRoute><LandingFAQ /></LandingRoute>
      },
      {
        path: 'hakkimizda',
        element: <LandingRoute><LandingHakkimizda /></LandingRoute>
      },
      {
        path: 'gizlilik',
        element: <LandingRoute><LandingGizlilikPolitikasi /></LandingRoute>
      },
      {
        path: 'kullanim-sartlari',
        element: <LandingRoute><LandingKullanimSartlari /></LandingRoute>
      },
      {
        path: 'kvkk',
        element: <LandingRoute><LandingKVKK /></LandingRoute>
      },
      {
        path: 'cerezler',
        element: <LandingRoute><LandingCerezler /></LandingRoute>
      }
    ]
  },
  // Login sayfası için özel route (AuthLayout bypass)
  {
    path: 'login',
    element: <PublicRoute><Login /></PublicRoute>
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
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
      // Öğrenci Yönetimi Sayfaları
      {
        path: 'students',
        element: <PrivateRoute><StudentsList /></PrivateRoute>
      },
      {
        path: 'students/new',
        element: <PrivateRoute><StudentForm /></PrivateRoute>
      },
      {
        path: 'students/edit/:id',
        element: <PrivateRoute><StudentForm /></PrivateRoute>
      },
      {
        path: 'students/import',
        element: <PrivateRoute><ExcelImport /></PrivateRoute>
      },
      // Sınıf Yönetimi Sayfaları
      {
        path: 'classes',
        element: <PrivateRoute><ClassesList /></PrivateRoute>
      },
      {
        path: 'classes/new',
        element: <PrivateRoute><ClassForm /></PrivateRoute>
      },
      {
        path: 'classes/edit/:id',
        element: <PrivateRoute><ClassForm /></PrivateRoute>
      },
      {
        path: 'classes/import',
        element: <PrivateRoute><ClassExcelImport /></PrivateRoute>
      },
      {
        path: 'classes/detail/:id',
        element: <PrivateRoute><ClassDetail /></PrivateRoute>
      },
      {
        path: 'classes/add-students/:id',
        element: <PrivateRoute><AddStudentsToClass /></PrivateRoute>
      },
      // Okul Yönetimi Sayfaları (Sadece Süperadmin)
      {
        path: 'schools',
        element: <SuperAdminRoute><SchoolsList /></SuperAdminRoute>
      },
      {
        path: 'schools/new',
        element: <SuperAdminRoute><SchoolForm /></SuperAdminRoute>
      },
      {
        path: 'schools/edit/:id',
        element: <SuperAdminRoute><SchoolForm /></SuperAdminRoute>
      },
      {
        path: 'schools/add-admin/:id',
        element: <SuperAdminRoute><AdminForm /></SuperAdminRoute>
      },
      // Kurumsal Sayfalar
      {
        path: 'hakkimizda',
        element: <Hakkimizda />
      },
      {
        path: 'kariyer',
        element: <Kariyer />
      },
      {
        path: 'gizlilik',
        element: <GizlilikPolitikasi />
      },
      {
        path: 'kullanim-sartlari',
        element: <KullanimSartlari />
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