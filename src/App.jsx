import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth_page from './components/Auth_page';
import Home from './components/Home';


function App() {
  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth_page />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App