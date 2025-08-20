import { createBrowserRouter, RouterProvider } from 'react-router'
import './App.css'
import { LoginForm } from './components/pages/LoginPage'
import { AppLayout } from './components/layout/AppLayout'
import LandingPage from './components/pages/LandingPage';
import { RegistrationForm } from './components/pages/SignUpPage';
import { HomePage } from './components/pages/HomePage';
import { ProtectedRoute } from './components/api/ProtectedRoute';

function App() {

  const router = createBrowserRouter([{
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <LoginForm />
      }, {
        path: '/register',
        element: <RegistrationForm />
      }, {
        path: '/home',
        element: <ProtectedRoute element={<HomePage />} />,
      }
    ]
  }]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

