import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import MyCourses from './pages/MyCourses'
import Dashboard from './pages/Dashboard'
import Course from './pages/Course'
import Home from './pages/Home'
import Footer from './components/Footer/Footer'

function App() {

  return (
    <>
      <Header />
      <div className='container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/my/courses' element={<MyCourses />} />
          <Route path='/my/' element={<Dashboard />}/>
          <Route path='/course' element={<Course />}/>
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
