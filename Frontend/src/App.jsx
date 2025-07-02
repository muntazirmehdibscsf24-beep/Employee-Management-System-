import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import "./App.css"
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginForm from './components/LoginForm'
import User from './User'
import CreateUser from './CreateUser'
import UpdateUser from './UpdateUser'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreateUser />
            </ProtectedRoute>
          } />
          <Route path="/update/:id" element={
            <ProtectedRoute>
              <UpdateUser />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
