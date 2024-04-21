import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import RootLayOut from './layouts/RootLayout/RootLayout.jsx'
import Login from './pages/LoginPage/Login.jsx'
import Courses from './pages/Courses/Courses.jsx'
import MyCourses from './pages/MyCourses/MyCourses.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import ErrorPage from './pages/ErrorPage/ErrorPage.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Teaching from './pages/Teaching/Teaching.jsx'
import ManagementLayout from './layouts/ManagementLayout/ManagementLayout.jsx'
import UserList from './pages/Admin/UserList/UserList.jsx'
import Schedule from './pages/Admin/Schedule/Schedule.jsx'
import AddP from './pages/AddP/AddP.jsx'
import ScoringPage from './pages/ScoringPage/ScoringPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayOut />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'courses',
        element: <Courses />
      },
      {
        path: 'myCourses',
        element: <MyCourses />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'teaching',
        element: <Teaching />
      },
      {
        path: 'AddP',
        element: <AddP />
      },
      {
        path: 'ScoringPage',
        element: <ScoringPage />
      },
      {
        path: 'admin',
        element: <ManagementLayout />,
        children:[
          {
            path: 'userlist/*',
            element: <UserList />
          },
          {
            path: 'schedule',
            element: <Schedule />
          }
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
)
