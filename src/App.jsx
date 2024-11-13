import React from 'react'
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";


const App = () => {
  return (
    <main>
      <Outlet />
    </main>
  )
}

export default App