import React from 'react'
import Menu from './pages/menu'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from './pages/login'
import Transaksi from './pages/transaksi'
import Home from './pages/home'
import Middleware from './pages/middleware'
import Sidebar from './pages/sidebar'
import Meja from './pages/meja'
import User from './pages/user'

export default function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path='/menu' element={<Middleware><Sidebar title="Daftar Menu"><Menu /></Sidebar></Middleware>}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/transaksi' element={<Middleware><Sidebar title="Daftar Transaksi"><Transaksi /></Sidebar></Middleware>}></Route>
        <Route path='/home' element={<Middleware><Sidebar title="Home"><Home /></Sidebar></Middleware>}></Route>
        <Route path='/meja' element={<Middleware><Sidebar title="Daftar Meja"><Meja /></Sidebar></Middleware>}></Route>
        <Route path='/user' element={<Middleware><Sidebar title="Daftar User"><User /></Sidebar></Middleware>}></Route>
        <Route path='/test' element={<Sidebar />}></Route>
      </Routes>
    </BrowserRouter>
  )
};
