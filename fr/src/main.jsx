import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import store from './Store/store.js';
import App from './App.jsx';
import Profile from './components/Profile.jsx';
import ViewPost from './components/ViewPost.jsx';
import UploadPost from './components/UploadPost.jsx';
import Sign_in_aur_up from './components/Sign_in_aur_up.jsx';
import './index.css';
import OTP from './components/OTP.jsx';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <ViewPost />
      },
      {
        path: '/sign_in_up',
        element: <Sign_in_aur_up />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/uploadPost',
        element: <UploadPost />
      },
      {
        path:'/verifyOTP',
        element:<OTP/>
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  </StrictMode>
);
