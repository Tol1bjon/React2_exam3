import { createBrowserRouter, RouterProvider } from 'react-router';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react'; // Импортируем иконку загрузки из lucide-react

// Ленивый импорт всех компонентов и Layout
const Layout = lazy(() => import('./layout/Layout'));
const Home = lazy(() => import('./Pages/Home'));
const Dushboard = lazy(() => import('./Pages/Dushboard'));
const Debts = lazy(() => import('./Pages/Debts'));
const Archive = lazy(() => import('./Pages/Archive'));
const Contacts = lazy(() => import('./Pages/Contacts'));
const Folders = lazy(() => import('./Pages/Folders'));
const Users = lazy(() => import('./Pages/Users'));
const Profile = lazy(() => import('./Pages/Profile'));
const LoginRegister = lazy(() => import('./Pages/Login_Register'));
const Error = lazy(() => import('./Pages/Error'));
const NotFound = lazy(() => import('./Pages/NotFound'));

// Красивый лоадер с иконкой из lucide-react в стиле Tailwind / shadcn
const LoadingFallback = (
  <div className='flex flex-col justify-center items-center h-screen gap-2 bg-background text-foreground'>
    <Loader2 className='h-8 w-8 animate-spin text-primary' />
    <p className='text-sm font-medium text-muted-foreground animate-pulse'>Загрузка...</p>
  </div>
);

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={LoadingFallback}>
          <Home />
        </Suspense>
      )
    },
    {
      path: '/home',
      element: (
        <Suspense fallback={LoadingFallback}>
          <Layout />
        </Suspense>
      ),
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={LoadingFallback}>
              <Dushboard />
            </Suspense>
          )
        },
        {
          path: 'debts',
          element: (
            <Suspense fallback={LoadingFallback}>
              <Debts />
            </Suspense>
          )
        },
        {
          path: 'archive',
          element: (
            <Suspense fallback={LoadingFallback}>
              <Archive />
            </Suspense>
          )
        },
        {
          path: 'contacts',
          element: (
            <Suspense fallback={LoadingFallback}>
              <Contacts />
            </Suspense>
          )
        },
        {
          path: 'folders',
          element: (
            <Suspense fallback={LoadingFallback}>
              <Folders />
            </Suspense>
          )
        },
        {
          path: 'users',
          element: (
            <Suspense fallback={LoadingFallback}>
              <Users />
            </Suspense>
          )
        },
        {
          path: 'profile',
          element: (
            <Suspense fallback={LoadingFallback}>
              <Profile />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '/login_and_register',
      element: (
        <Suspense fallback={LoadingFallback}>
          <LoginRegister />
        </Suspense>
      )
    },
    {
      path: '/error',
      element: (
        <Suspense fallback={LoadingFallback}>
          <Error />
        </Suspense>
      )
    },
    {
      path: '*',
      element: (
        <Suspense fallback={LoadingFallback}>
          <NotFound />
        </Suspense>
      )
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;