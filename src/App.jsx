import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import ForgotPassword from './pages/Auth/ForgotPassword';

import Home from './pages/Hotel/Home';
import SearchResults from './pages/Hotel/SearchResults';
import RoomDetail from './pages/Hotel/RoomDetail';
import Payment from './pages/Hotel/Payment';
import MyProfile from './pages/Profile/MyProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/hotel/:id" element={<RoomDetail />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile" element={<MyProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
