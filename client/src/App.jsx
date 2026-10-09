import React, { useContext } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import UserDashBoard from './pages/UserDashBoard'
import Home from './pages/Home'
import ApppLayOut from './component/ApppLayOut'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'

// 🔐 Admin Route Guard Component
const AdminGuard = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-semibold text-sm animate-pulse">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  // Agar user null hai ya admin nahi hai, tabhi kickout karo
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/',
      element: <ApppLayOut />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/admin',
          element: (
            <AdminGuard>
              <Admin />
            </AdminGuard>
          ),
        },
        {
          path: '/dashboard',
          element: <UserDashBoard />,
        },
        {
          path: '/cart',
          element: <Cart />,
        },
        {
          path: '/products/:id',
          element: <ProductDetails />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;