import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Bell } from 'lucide-react';

const ForgotPassword = () => {
  // Trạng thái để chuyển đổi giữa 2 bước (step 1: Nhập email, step 2: Đặt lại mật khẩu)
  const [step, setStep] = useState(1);

  const handleSendRequest = (e) => {
    e.preventDefault();
    // Giả lập việc gửi yêu cầu thành công, chuyển sang bước đặt lại mật khẩu
    setStep(2);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    // Xử lý cập nhật mật khẩu ở đây
    alert('Cập nhật mật khẩu thành công!');
    // Có thể dùng navigate('/login') để chuyển về đăng nhập
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      
      {/* Header */}
      <header className="bg-[#e5e5e5] py-4 px-8 md:px-16 flex justify-between items-center shadow-sm">
        <div className="text-3xl font-serif font-bold text-[#403B69]">
          NoWayHome
        </div>
        <div className="flex items-center space-x-6">
          <span className="font-bold text-[#403B69] hidden md:inline-block">
            Xin chào, Duong!
          </span>
          <button className="text-gray-800 hover:text-black">
            <User className="w-6 h-6" />
          </button>
          <button className="text-gray-800 hover:text-black relative">
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 w-full max-w-[1440px] mx-auto">
        <div className="w-full max-w-lg mb-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-serif font-bold text-black">
              Khôi phục mật khẩu
            </h1>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendRequest} className="px-4 md:px-12">
              <div className="mb-10">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Email / Phone
                </label>
                <input
                  type="text"
                  placeholder="Nhập thông tin"
                  className="w-full border-b border-gray-400 py-3 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#403B69] hover:bg-[#2d2a4a] text-white py-3.5 font-semibold transition-colors mb-6"
              >
                Gửi yêu cầu
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="font-bold text-[#403B69] hover:text-[#2d2a4a] underline underline-offset-4"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleUpdatePassword} className="px-4 md:px-12">
              <div className="mb-8">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  className="w-full border-b border-gray-400 py-3 text-gray-900 focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <div className="mb-12">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  className="w-full border-b border-gray-400 py-3 text-gray-900 focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#403B69] hover:bg-[#2d2a4a] text-white py-3.5 font-semibold transition-colors"
              >
                Cập nhật
              </button>
            </form>
          )}
        </div>
      </main>

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

export default ForgotPassword;
