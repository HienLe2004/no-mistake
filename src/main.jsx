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
import CourseList from './pages/Admin/CourseList/CourseList.jsx'
import Announcement from './pages/Admin/Announcement/Announcement.jsx'
import UserInformation from './pages/Admin/UserList/UserInformation/UserInformation.jsx'
import CourseInformation from './pages/Admin/CourseList/CourseInformation/CourseInformation.jsx'
import ScheduleInformation from './pages/Admin/Schedule/ScheduleInformation/ScheduleInformation.jsx'
import CourseData from './pages/MyCourses/CourseData/CourseData.jsx'

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
        path: ':cid',
        element: <CourseData />
      }
      ,
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
        path: 'admin',
        element: <ManagementLayout />,
        children: [
          {
            path: 'userlist',
            element: <UserList />,
            children: [
              {
                path: ':uid',
                element: <UserInformation />
              }
            ]
          },
          {
            path: 'schedule',
            element: <Schedule />,
            children: [
              {
                path: ':cid',
                element: <ScheduleInformation />
              }
            ]
          },
          {
            path: 'courselist',
            element: <CourseList />,
            children: [
              {
                path: ':cid',
                element: <CourseInformation />
              }
            ]
          },
          {
            path: 'announcement',
            element: <Announcement />
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
