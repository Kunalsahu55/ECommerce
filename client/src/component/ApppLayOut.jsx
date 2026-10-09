import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

const ApppLayOut = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default ApppLayOut
