import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import MyCourses from './pages/MyCourses/MyCourses'
import Dashboard from './pages/Dashboard/Dashboard'
import Course from './pages/Course/Course'
import Home from './pages/Home/Home'
import Login from './pages/LoginPage/Login'

function App() {

  return (
    <>
      <div className='container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/my/courses' element={<MyCourses />} />
          <Route path='/my/' element={<Dashboard />}/>
          <Route path='/course' element={<Course />}/>
          <Route path='/login' element={<Login />}/>
        </Routes>
      </div>
    </>
  )
}

export default App
