import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import "./App.css"
import User from './User'
import CreateUser from './CreateUser'
import UpdateUser from './UpdateUser'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/create" element={<CreateUser />} />
        <Route path="/update/:id" element={<UpdateUser />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App