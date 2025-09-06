import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import Dashboard from "@/components/pages/Dashboard"
import Properties from "@/components/pages/Properties"
import PropertyDetail from "@/components/pages/PropertyDetail"
import Team from "@/components/pages/Team"
import Commissions from "@/components/pages/Commissions"
import Messages from "@/components/pages/Messages"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="properties/:id" element={<PropertyDetail />} />
            <Route path="team" element={<Team />} />
            <Route path="commissions" element={<Commissions />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="toastify-container"
        />
      </div>
    </BrowserRouter>
  )
}

export default App