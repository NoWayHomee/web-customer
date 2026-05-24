// === TransactionHistory.jsx - Trang Lịch sử giao dịch ===
// Hiển thị danh sách các giao dịch đặt chỗ của người dùng với bộ lọc và phân trang

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  User, Bell, ChevronRight, ChevronLeft,
  Receipt, Heart, Settings, BedDouble
} from 'lucide-react';



// ====== DỮ LIỆU MẪU - các giao dịch (khớp với ảnh thiết kế) ======
const mockTransactions = [
  {
    id: 1,
    orderCode: '#TRV-8942',
    name: 'Khách sạn Rex Saigon',
    dateBooked: '15/10/2024',
    dateRange: '20/10 - 23/10/2024',
    price: '3.500.000 đ',
    status: 'success',
  },
  {
    id: 2,
    orderCode: '#FLG-4123',
    name: 'Halong Elegence',
    dateBooked: '24/10/2024',
    dateRange: '05/11/2024',
    price: '2.100.000 đ',
    status: 'processing',
  },
  {
    id: 3,
    orderCode: '#ACT-9011',
    name: 'Vinpearl Resort',
    dateBooked: '01/09/2024',
    dateRange: '15/09/2024',
    price: '1.800.000 đ',
    status: 'cancelled',
  },
];

const TransactionHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dropdown lọc trạng thái
  const [statusFilter, setStatusFilter] = useState('all');
  // Trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'success', label: 'Thành công' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  // Lọc theo trạng thái
  const filteredTransactions = mockTransactions.filter((t) =>
    statusFilter === 'all' || t.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-900 flex flex-col">

      {/* ===== HEADER ===== */}
      <header className="bg-[#E5E5E5] py-4 px-8 md:px-16 flex justify-between items-center shadow-sm relative z-50">
        <Link to="/" className="text-3xl font-serif font-bold text-[#403B69]">
          NoWayHome
        </Link>
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <span className="font-bold text-[#403B69] hidden md:inline-block">
                Xin chào, {user.name}!
              </span>
              <Link to="/profile" className="text-gray-800 hover:text-black transition-transform hover:scale-110">
                <User className="w-6 h-6" />
              </Link>
              <button className="text-gray-800 hover:text-black relative transition-transform hover:scale-110">
                <Bell className="w-6 h-6" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-bold text-[#403B69] hover:underline">Đăng nhập</Link>
              <Link to="/register" className="font-bold text-white bg-[#403B69] px-4 py-2 rounded-lg hover:bg-[#2d2a4a] transition-colors">Đăng ký</Link>
            </>
          )}
        </div>
      </header>

      {/* ===== MAIN LAYOUT ===== */}
      <main className="max-w-[1300px] w-full mx-auto px-6 pt-10 flex-1 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* === BÊN TRÁI: Sidebar Menu === */}
          <div className="w-full lg:w-[260px] bg-white rounded-2xl border border-gray-200 p-6 flex flex-col self-start">
            {/* Avatar & thông tin tài khoản */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden bg-gray-100">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&hair=shortCombover&beard=medium&eyebrows=default&eyes=default&mouth=default"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-[#0064a3] text-base leading-tight truncate max-w-[145px]">
                  {user?.name || 'Tài khoản'}
                </h3>
                <p className="text-gray-500 text-xs">Premium Member</p>
              </div>
            </div>

            {/* Nút Upgrade Plan */}
            <button className="w-full bg-[#F58F00] hover:bg-[#e08200] text-white font-bold py-2 rounded-xl transition-colors mb-5 text-sm">
              Upgrade Plan
            </button>

            <hr className="border-gray-200 mb-4" />

            {/* Menu điều hướng */}
            <div className="flex flex-col space-y-0.5">
              <Link
                to="/edit-profile"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">Edit Profile</span>
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Heart className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">Danh sách yêu thích</span>
              </Link>

              {/* Active - Lịch sử giao dịch */}
              <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-[#0064a3] text-white shadow-sm cursor-default">
                <Receipt className="w-4 h-4 shrink-0" />
                <span className="text-sm font-semibold">Lịch sử giao dịch</span>
              </div>

              <Link
                to="/settings"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">Cài đặt</span>
              </Link>
            </div>
          </div>

          {/* === BÊN PHẢI: Nội dung Lịch sử giao dịch === */}
          <div className="flex-1 w-full bg-white rounded-2xl border border-gray-200 p-8 flex flex-col">

            {/* Tiêu đề trang */}
            <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Lịch sử giao dịch</h1>
            <p className="text-gray-500 text-sm mb-6">Xem và quản lý các giao dịch đặt chỗ của bạn</p>

            {/* Dropdown lọc trạng thái */}
            <div className="mb-5">
              <div className="relative inline-block">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#0064a3] cursor-pointer"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* ====== DANH SÁCH GIAO DỊCH ====== */}
            <div className="flex flex-col gap-3 flex-1">
              {filteredTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Receipt className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-lg font-semibold">Không có giao dịch nào</p>
                  <p className="text-sm mt-1">Hãy thử thay đổi bộ lọc tìm kiếm</p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-4 border border-gray-200 rounded-xl px-5 py-4 bg-white"
                  >
                    {/* Icon giường (hotel) */}
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <BedDouble className="w-5 h-5 text-blue-500" />
                    </div>

                    {/* Thông tin đơn hàng */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">
                        Mã đơn: <span className="font-semibold text-gray-700">{transaction.orderCode}</span>
                      </p>
                      <p className="font-bold text-gray-900 text-sm">{transaction.name}</p>
                    </div>

                    {/* Ngày đặt & ngày thực hiện */}
                    <div className="hidden md:block text-xs text-gray-500 min-w-[130px]">
                      <p>Ngày đặt: <span className="font-semibold text-gray-700">{transaction.dateBooked}</span></p>
                      <p className="text-gray-400 mt-0.5">{transaction.dateRange}</p>
                    </div>

                    {/* Giá tiền */}
                    <div className="min-w-[120px] text-right">
                      <span
                        className={`text-base font-bold ${
                          transaction.status === 'cancelled'
                            ? 'text-gray-400 line-through'
                            : 'text-gray-900'
                        }`}
                      >
                        {transaction.price}
                      </span>
                    </div>

                    {/* Trạng thái + Hành động */}
                    <div className="min-w-[120px] flex flex-col items-end gap-1">
                      {/* Badge trạng thái */}
                      {transaction.status === 'success' && (
                        <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                          Thành công
                        </span>
                      )}
                      {transaction.status === 'processing' && (
                        <span className="text-xs font-semibold text-orange-500">
                          Đang xử lý
                        </span>
                      )}
                      {transaction.status === 'cancelled' && (
                        <span className="text-xs font-semibold text-white bg-red-500 px-2 py-0.5 rounded">
                          Đã hủy
                        </span>
                      )}

                      {/* Nút hành động */}
                      {transaction.status === 'success' && (
                        <button className="text-[#0064a3] text-xs font-semibold hover:underline flex items-center gap-0.5">
                          Xem chi tiết <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                      {transaction.status === 'processing' && (
                        <button className="text-[#0064a3] text-xs font-bold hover:underline">
                          Thanh toán ngay ›
                        </button>
                      )}
                      {transaction.status === 'cancelled' && (
                        <button className="text-gray-500 text-xs font-semibold hover:underline flex items-center gap-0.5">
                          Xem chi tiết <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ====== PHÂN TRANG ====== */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {/* Nút trước */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-gray-500 hover:border-[#0064a3] hover:text-[#0064a3] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Số trang */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-colors ${
                    currentPage === page
                      ? 'bg-[#0064a3] text-white border-[#0064a3]'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-[#0064a3] hover:text-[#0064a3]'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Nút tiếp */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-gray-500 hover:border-[#0064a3] hover:text-[#0064a3] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#f3f4f6] border-t border-gray-200 py-6">
        <div className="max-w-[1300px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-medium">
          <div className="text-[#403B69] font-serif font-bold text-lg mb-4 md:mb-0">
            NoWayHome
          </div>
          <div className="flex space-x-6 mb-4 md:mb-0 uppercase tracking-wider">
            <Link to="#" className="hover:text-gray-800">Privacy</Link>
            <Link to="#" className="hover:text-gray-800">Terms</Link>
            <Link to="#" className="hover:text-gray-800">Cookie Policy</Link>
            <Link to="#" className="hover:text-gray-800">Feedback</Link>
          </div>
          <div className="uppercase tracking-wider">
            © 2026 NOWAYHOME. ĐẶT PHÒNG NHANH, TRẢI NGHIỆM CHẤT.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TransactionHistory;
