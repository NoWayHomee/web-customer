import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    login({ name: name || 'Người dùng mới' });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      <div className="flex-grow flex max-w-[1440px] mx-auto w-full pt-10 px-4 md:px-10">
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 md:px-16 lg:px-24 pb-10">
          <div className="w-full max-w-md mx-auto">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-serif font-bold text-black mb-3">NoWayHome</h1>
              <p className="text-gray-700 text-lg font-serif">Đặt phòng nhanh, trải nghiệm chất</p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister}>
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border-b border-gray-400 py-2 text-gray-900 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  UUID / Email / Phone
                </label>
                <input
                  type="text"
                  className="w-full border-b border-gray-400 py-2 text-gray-900 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full border-b border-gray-400 py-2 text-gray-900 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="mb-8">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  className="w-full border-b border-gray-400 py-2 text-gray-900 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#403B69] hover:bg-[#2d2a4a] text-white py-3 font-semibold transition-colors mt-2"
              >
                Đăng kí
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-8">
              <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
                Hoặc đăng nhập với
              </p>
              <div className="flex justify-center space-x-4">
                <button type="button" className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-xl text-gray-700">G</span>
                </button>
                <button type="button" className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-xl text-gray-700">f</span>
                </button>
                <button type="button" className="w-16 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-sm text-gray-700">Zalo</span>
                </button>
                <button type="button" className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-5 h-5 fill-current text-gray-700"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
                </button>
              </div>
            </div>

            {/* Bottom Links */}
            <div className="mt-10 text-center text-sm space-y-2">
              <p>
                Bạn là chủ khách sạn?{' '}
                <Link to="#" className="font-bold text-[#403B69] hover:underline">
                  Đăng nhập dành cho Đối tác
                </Link>
              </p>
              {/* Note: I added a link back to Login here so users can navigate back. 
                  Even though it's not strictly in the image, it's essential for navigation based on your previous request. */}
              <p className="mt-4">
                <Link to="/login" className="font-bold text-gray-500 hover:text-black hover:underline">
                  Quay lại Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="hidden lg:block lg:w-1/2 relative pb-10 pr-4 md:pr-0">
          <img
            src="https://images.unsplash.com/photo-1572331165267-854da2b10ccc?q=80&w=2000&auto=format&fit=crop"
            alt="Pool Deck"
            className="w-full h-full object-cover rounded-sm"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#f3f4f6] py-6 px-4 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-medium space-y-4 md:space-y-0">
        <div className="font-bold text-[#403B69] text-sm">NoWayHome</div>
        <div className="flex space-x-6">
          <Link to="#" className="hover:text-gray-800">PRIVACY</Link>
          <Link to="#" className="hover:text-gray-800">TERMS</Link>
          <Link to="#" className="hover:text-gray-800">COOKIE POLICY</Link>
          <Link to="#" className="hover:text-gray-800">FEEDBACK</Link>
        </div>
        <div>© 2026 NOWAYHOME. ĐẶT PHÒNG NHANH, TRẢI NGHIỆM CHẤT.</div>
      </footer>
    </div>
  );
};

export default Register;
