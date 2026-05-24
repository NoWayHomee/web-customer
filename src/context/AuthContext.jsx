// === AuthContext.jsx - Quản lý trạng thái xác thực (đăng nhập/đăng xuất) người dùng ===
// Sử dụng React Context API để chia sẻ thông tin user cho toàn bộ ứng dụng
// Bất kỳ component nào cũng có thể gọi useAuth() để lấy thông tin user hiện tại

import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo Context để lưu trữ trạng thái xác thực
const AuthContext = createContext();

// Hook tùy chỉnh: useAuth() - cho phép các component con dễ dàng truy cập context xác thực
// Ví dụ sử dụng: const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);

// AuthProvider - Component bọc (wrapper) cung cấp trạng thái xác thực cho toàn bộ ứng dụng
export const AuthProvider = ({ children }) => {
  // State lưu trữ thông tin người dùng đang đăng nhập (null nếu chưa đăng nhập)
  const [user, setUser] = useState(null);

  // Khi ứng dụng khởi động, kiểm tra localStorage xem có thông tin user đã lưu trước đó không
  // Nếu có → tự động đăng nhập lại (giữ phiên đăng nhập khi reload trang)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Hàm đăng nhập: Lưu thông tin user vào state và localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Hàm đăng xuất: Xóa thông tin user khỏi state và localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Hàm cập nhật thông tin user: Merge dữ liệu mới vào user hiện tại
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // Cung cấp giá trị { user, login, logout, updateUser } cho tất cả component con
  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
