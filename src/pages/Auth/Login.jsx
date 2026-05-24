// === Login.jsx - Trang Đăng nhập ===
// Cho phép người dùng đăng nhập bằng email/UUID/số điện thoại và mật khẩu
// Hỗ trợ đăng nhập qua mạng xã hội (Google, Facebook, Zalo, Apple)

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// useAuth: Hook để truy cập hàm login từ AuthContext
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  // State lưu giá trị email người dùng nhập vào ô input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  // Lấy hàm login từ AuthContext để thực hiện đăng nhập
  const { login } = useAuth();
  // Hook điều hướng: dùng để chuyển trang sau khi đăng nhập thành công
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy đường dẫn trước đó để quay lại sau khi đăng nhập, mặc định là trang chủ
  const from = location.state?.from || '/';

  // Validate form trước khi đăng nhập
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập tài khoản (UUID/Email/Phone)';
    } else {
      if (email.includes('@')) {
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim())) {
          newErrors.email = 'Email không hợp lệ (yêu cầu @gmail.com)';
        }
      } else if (/^(0|\+84|84)/.test(email.trim())) {
        if (!/^(0|\+84|84)(3|5|7|8|9)[0-9]{8}$/.test(email.trim().replace(/\s/g, ''))) {
          newErrors.email = 'Số điện thoại không hợp lệ (phải đủ 10 số)';
        }
      }
    }
    if (!password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý khi người dùng nhấn nút "Đăng nhập"
  const handleLogin = (e) => {
    e.preventDefault(); // Ngăn chặn form reload trang
    
    if (!validate()) return; // Dừng lại nếu có lỗi
    
    // Giả lập: Lấy tên từ email (phần trước @) để hiển thị tên người dùng
    const name = email.split('@')[0];
    // Gọi hàm login để lưu thông tin user vào context và localStorage
    login({ name: name || 'Người dùng' });
    // Chuyển hướng về trang trước đó hoặc trang chủ sau khi đăng nhập
    navigate(from);
  };

  return (
    // Container chính: Chiều cao tối thiểu = toàn màn hình, nền trắng
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      {/* Container bố cục 2 cột: Form bên trái, Ảnh bên phải */}
      <div className="flex-grow flex max-w-[1440px] mx-auto w-full pt-10 px-4 md:px-10">
        {/* ===== CỘT TRÁI: Form đăng nhập ===== */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 md:px-16 lg:px-24 pb-10">
          <div className="w-full max-w-md mx-auto">
            {/* --- Logo và slogan --- */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-serif font-bold text-black mb-3">NoWayHome</h1>
              <p className="text-gray-700 text-lg font-serif">Đặt phòng nhanh, trải nghiệm chất</p>
            </div>

            {/* --- Form nhập thông tin đăng nhập --- */}
            <form onSubmit={handleLogin}>
              {/* Ô nhập UUID / Email / Số điện thoại */}
              <div className="mb-8">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  UUID / Email / Phone
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="Nhập thông tin"
                  className={`w-full border-b py-2 text-gray-900 placeholder-gray-300 focus:outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-400 focus:border-black'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Ô nhập mật khẩu */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={`w-full border-b py-2 text-gray-900 focus:outline-none transition-colors ${errors.password ? 'border-red-500' : 'border-gray-400 focus:border-black'}`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Link quên mật khẩu - điều hướng sang trang ForgotPassword */}
              <div className="flex justify-end mb-8">
                <Link to="/forgot-password" className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-widest">
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Nút đăng nhập - màu tím thương hiệu #403B69 */}
              <button
                type="submit"
                className="w-full bg-[#403B69] hover:bg-[#2d2a4a] text-white py-3 font-semibold transition-colors"
              >
                Đăng nhập
              </button>
            </form>

            {/* --- Phần đăng nhập bằng mạng xã hội --- */}
            <div className="mt-10">
              <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
                Hoặc đăng nhập với
              </p>
              {/* Các nút đăng nhập: Google (G), Facebook (f), Zalo, Apple */}
              <div className="flex justify-center space-x-4">
                {/* Nút Google */}
                <button type="button" className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-xl text-gray-700">G</span>
                </button>
                {/* Nút Facebook */}
                <button type="button" className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-xl text-gray-700">f</span>
                </button>
                {/* Nút Zalo */}
                <button type="button" className="w-16 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-sm text-gray-700">Zalo</span>
                </button>
                {/* Nút Apple - sử dụng icon SVG logo Apple */}
                <button type="button" className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-5 h-5 fill-current text-gray-700"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                </button>
              </div>
            </div>

            {/* --- Liên kết chuyển trang: Đăng ký & Đối tác --- */}
            <div className="mt-12 text-center text-sm space-y-2">
              <p>
                Chưa có tài khoản?{' '}
                <Link to="/register" className="font-bold text-[#403B69] hover:underline">
                  Đăng kí ngay
                </Link>
              </p>
              <p>
                Bạn là chủ khách sạn?{' '}
                <Link to="#" className="font-bold text-[#403B69] hover:underline">
                  Đăng nhập dành cho Đối tác
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* ===== CỘT PHẢI: Ảnh minh họa (chỉ hiện trên màn hình lớn lg+) ===== */}
        <div className="hidden lg:block lg:w-1/2 relative pb-10 pr-4 md:pr-0">
          <img
            src="https://images.unsplash.com/photo-1572331165267-854da2b10ccc?q=80&w=2000&auto=format&fit=crop"
            alt="Pool Deck"
            className="w-full h-full object-cover rounded-sm"
          />
        </div>
      </div>

      {/* ===== FOOTER: Thanh cuối trang với logo, liên kết chính sách, bản quyền ===== */}
      <footer className="bg-[#f3f4f6] py-6 px-4 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-medium space-y-4 md:space-y-0">
        {/* Logo thương hiệu */}
        <div className="font-bold text-[#403B69] text-sm">NoWayHome</div>
        {/* Các liên kết chính sách */}
        <div className="flex space-x-6">
          <Link to="#" className="hover:text-gray-800">PRIVACY</Link>
          <Link to="#" className="hover:text-gray-800">TERMS</Link>
          <Link to="#" className="hover:text-gray-800">COOKIE POLICY</Link>
          <Link to="#" className="hover:text-gray-800">FEEDBACK</Link>
        </div>
        {/* Thông tin bản quyền */}
        <div>© 2026 NOWAYHOME. ĐẶT PHÒNG NHANH, TRẢI NGHIỆM CHẤT.</div>
      </footer>
    </div>
  );
};

export default Login;
