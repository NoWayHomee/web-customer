import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../../context/AuthContext';
import { 
  User, Bell, MapPin, Calendar, Search, 
  Building2, CheckCircle2, Tag, MessageSquare,
  Backpack, Luggage, Umbrella, Phone, Mail, ChevronRight
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Search State
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  
  const [location, setLocation] = useState('');
  
  const [showGuestPopover, setShowGuestPopover] = useState(false);
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });

  const handleGuestChange = (type, operation) => {
    setGuests(prev => {
      const newValue = operation === 'inc' ? prev[type] + 1 : prev[type] - 1;
      if (newValue < 0) return prev;
      if (type === 'adults' && newValue < 1) return prev; // At least 1 adult
      if (type === 'rooms' && newValue < 1) return prev; // At least 1 room
      return { ...prev, [type]: newValue };
    });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    params.append('adults', guests.adults);
    params.append('children', guests.children);
    params.append('rooms', guests.rooms);
    
    navigate(`/search-results?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <header className="bg-[#e5e5e5] py-4 px-8 md:px-16 flex justify-between items-center shadow-sm relative z-50">
        <div className="text-3xl font-serif font-bold text-[#403B69]">
          NoWayHome
        </div>
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
              <Link to="/login" className="font-bold text-[#403B69] hover:underline">
                Đăng nhập
              </Link>
              <Link to="/register" className="font-bold text-white bg-[#403B69] px-4 py-2 rounded-lg hover:bg-[#2d2a4a] transition-colors">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex flex-col items-center pt-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=2000&auto=format&fit=crop" 
            alt="Scenic Road" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1200px] px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-md">
            Khám phá chuyến đi tiếp theo của bạn
          </h1>
          <p className="text-lg md:text-xl text-white mb-10 drop-shadow-md">
            Đặt khách sạn, vé máy bay với tour du lịch dễ dàng với giá tốt nhất
          </p>

          {/* Search Box Wrapper */}
          <div className="bg-transparent mb-6">
            {/* Tabs */}
            <div className="flex bg-[#f4f4f4]/90 backdrop-blur-sm rounded-t-2xl overflow-hidden w-max shadow-lg">
              <button className="px-6 py-4 bg-white font-bold text-sm text-black">Khách sạn</button>
              <button className="px-6 py-4 text-gray-800 font-bold text-sm hover:bg-white/50 transition-colors">Phương tiện di chuyển</button>
              <button className="px-6 py-4 text-gray-800 font-bold text-sm hover:bg-white/50 transition-colors">Vé máy bay</button>
              <button className="px-6 py-4 text-gray-800 font-bold text-sm hover:bg-white/50 transition-colors">Đưa đón sân bay</button>
              <button className="px-6 py-4 text-gray-800 font-bold text-sm hover:bg-white/50 transition-colors">Hoạt động vui chơi</button>
              <button className="px-6 py-4 text-gray-800 font-bold text-sm hover:bg-white/50 transition-colors">Tour du lịch</button>
            </div>

            {/* Search Form */}
            <div className="bg-white p-6 rounded-b-2xl rounded-tr-2xl shadow-xl flex flex-col md:flex-row gap-4 items-center">
              
              <div className="flex-1 w-full border border-gray-300 rounded-xl p-3 flex items-center hover:border-gray-500 transition-colors cursor-text">
                <MapPin className="w-6 h-6 text-gray-400 mr-3" />
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-sm text-gray-900">Địa điểm du lịch, tên khách sạn</span>
                  <input 
                    type="text" 
                    placeholder="Bạn muốn đi đâu" 
                    className="text-sm text-gray-500 outline-none w-full bg-transparent" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 w-full border border-gray-300 rounded-xl p-3 flex items-center hover:border-gray-500 transition-colors cursor-pointer relative z-40">
                <Calendar className="w-6 h-6 text-gray-400 mr-3" />
                <div className="flex flex-col flex-1 w-full">
                  <span className="font-bold text-sm text-gray-900">Ngày nhận phòng - Ngày trả phòng</span>
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    placeholderText="dd/mm/yyyy - dd/mm/yyyy"
                    className="text-sm text-gray-500 outline-none w-full bg-transparent cursor-pointer"
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                  />
                </div>
              </div>

              <div className="flex-1 w-full border border-gray-300 rounded-xl p-3 flex items-center hover:border-gray-500 transition-colors cursor-pointer relative z-40" onClick={() => setShowGuestPopover(!showGuestPopover)}>
                <User className="w-6 h-6 text-gray-400 mr-3" />
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-sm text-gray-900">Số lượng khách và phòng</span>
                  <span className="text-sm text-gray-500">{guests.adults} người lớn, {guests.children} trẻ em, {guests.rooms} phòng</span>
                </div>
                
                {/* Guest Popover */}
                {showGuestPopover && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-5 z-50 cursor-default" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="font-bold text-gray-800">Người lớn</div>
                        <div className="text-xs text-gray-500">Từ 13 tuổi trở lên</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => handleGuestChange('adults', 'dec')} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={guests.adults <= 1}>-</button>
                        <span className="w-4 text-center font-medium">{guests.adults}</span>
                        <button onClick={() => handleGuestChange('adults', 'inc')} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-800 transition-colors">+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="font-bold text-gray-800">Trẻ em</div>
                        <div className="text-xs text-gray-500">Dưới 13 tuổi</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => handleGuestChange('children', 'dec')} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={guests.children <= 0}>-</button>
                        <span className="w-4 text-center font-medium">{guests.children}</span>
                        <button onClick={() => handleGuestChange('children', 'inc')} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-800 transition-colors">+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-800">Phòng</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => handleGuestChange('rooms', 'dec')} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={guests.rooms <= 1}>-</button>
                        <span className="w-4 text-center font-medium">{guests.rooms}</span>
                        <button onClick={() => handleGuestChange('rooms', 'inc')} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-800 transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handleSearch} className="w-14 h-14 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 hover:scale-105 transition-all flex-shrink-0 shadow-md z-40 relative">
                <Search className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex items-center space-x-3">
            <span className="text-white font-medium text-sm drop-shadow-md">Tìm kiếm phổ biến:</span>
            <button className="px-4 py-1.5 rounded-full border border-white/40 bg-white/10 text-white text-sm hover:bg-white/20 transition-colors backdrop-blur-sm">Hạ Long</button>
            <button className="px-4 py-1.5 rounded-full border border-white/40 bg-white/10 text-white text-sm hover:bg-white/20 transition-colors backdrop-blur-sm">Đà Lạt</button>
            <button className="px-4 py-1.5 rounded-full border border-white/40 bg-white/10 text-white text-sm hover:bg-white/20 transition-colors backdrop-blur-sm">Đà Nẵng</button>
            <button className="px-4 py-1.5 rounded-full border border-white/40 bg-white/10 text-white text-sm hover:bg-white/20 transition-colors backdrop-blur-sm">Nha Trang</button>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-12 relative z-20 mb-20">
        <div className="bg-[#f8f9fa] rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          
          <div className="flex items-start px-4 group cursor-pointer">
            <div className="p-3 bg-blue-100 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">10.000+ Khách sạn</h3>
              <p className="text-xs text-gray-600">Đa dạng lựa chọn</p>
            </div>
          </div>

          <div className="flex items-start px-4 group cursor-pointer">
            <div className="p-3 bg-green-100 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">1.000.000+ Lượt đặt phòng</h3>
              <p className="text-xs text-gray-600">Thành công mỗi năm</p>
            </div>
          </div>

          <div className="flex items-start px-4 group cursor-pointer">
            <div className="p-3 bg-orange-100 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
              <Tag className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Giá tốt mỗi ngày</h3>
              <p className="text-xs text-gray-600">Cam kết giá tốt nhất cho mọi chuyến đi</p>
            </div>
          </div>

          <div className="flex items-start px-4 group cursor-pointer">
            <div className="p-3 bg-gray-200 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Hỗ trợ 24/7</h3>
              <p className="text-xs text-gray-600">Đội ngũ hỗ trợ luôn sẵn sàng phục vụ</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Sections */}
      <main className="max-w-[1200px] mx-auto px-6 space-y-20 pb-20">
        
        {/* Section 1: Chương trình khuyến mại chỗ ở */}
        <section>
          <h2 className="text-3xl font-bold text-[#2a2456] mb-8">Chương trình khuyến mại chỗ ở</h2>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="relative h-56 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Promo" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
                  <p className="text-white font-medium text-lg mb-1">Voucher cho người mới</p>
                  <p className="text-white font-bold text-4xl">Giảm 30%</p>
                </div>
              </div>

              <div className="relative h-56 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Promo" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
                  <p className="text-white font-medium text-lg mb-1">Combo Homestay Đà Lạt 2N1Đ</p>
                  <p className="text-white font-bold text-4xl">1999k</p>
                </div>
              </div>

              <div className="relative h-56 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Promo" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
                  <p className="text-white font-bold text-2xl leading-tight">Combo Vé máy bay<br/>& Biệt thự</p>
                </div>
              </div>
            </div>
            
            {/* Arrow Button */}
            <button className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#f4f4f4] rounded-full flex items-center justify-center shadow-md hover:bg-gray-200 hover:scale-110 transition-all z-10 hidden md:flex">
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </section>

        {/* Section 2: Khuyến mại Chuyến bay và Hoạt động */}
        <section>
          <h2 className="text-3xl font-bold text-[#2a2456] mb-8">Khuyến mại Chuyến bay và Hoạt động</h2>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="relative h-56 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Flight" />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
                  <p className="text-white font-bold text-2xl mb-1">Vietnam Airlines</p>
                  <p className="text-white font-medium text-xl">Giảm 200k/ chặng</p>
                </div>
              </div>

              <div className="relative h-56 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Ha Long" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
                  <p className="text-white font-bold text-2xl mb-1">Ha Long Bay Cruise</p>
                  <p className="text-white font-medium text-xl">Giảm 20%</p>
                </div>
              </div>

              <div className="relative h-56 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1559586616-361e18714958?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Ninh Binh" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
                  <p className="text-white font-bold text-2xl mb-1">Tour Ninh Binh</p>
                  <p className="text-white font-medium text-xl">Tiết kiệm 500k</p>
                </div>
              </div>

            </div>

            {/* Arrow Button */}
            <button className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#f4f4f4] rounded-full flex items-center justify-center shadow-md hover:bg-gray-200 hover:scale-110 transition-all z-10 hidden md:flex">
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </section>

        {/* Section 3: Cẩm nang du lịch */}
        <section>
          <h2 className="text-3xl font-bold text-[#2a2456] mb-8">Cẩm nang du lịch</h2>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white border border-gray-300 rounded-2xl p-8 flex items-center group cursor-pointer hover:border-gray-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <Backpack className="w-14 h-14 text-gray-800 mr-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                <h3 className="font-bold text-gray-900 text-lg leading-snug">Vật dụng cần thiết<br/>khi đi du lịch</h3>
              </div>

              <div className="bg-white border border-gray-300 rounded-2xl p-8 flex items-center group cursor-pointer hover:border-gray-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <Luggage className="w-14 h-14 text-gray-800 mr-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                <h3 className="font-bold text-gray-900 text-lg leading-snug">Cách đặt vé máy bay<br/>tiết kiệm</h3>
              </div>

              <div className="bg-white border border-gray-300 rounded-2xl p-8 flex items-center group cursor-pointer hover:border-gray-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <Umbrella className="w-14 h-14 text-gray-800 mr-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                <h3 className="font-bold text-gray-900 text-lg leading-snug">5 bãi biển đẹp nhất<br/>miền Bắc</h3>
              </div>

            </div>

            {/* Arrow Button */}
            <button className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#f4f4f4] rounded-full flex items-center justify-center shadow-md hover:bg-gray-200 hover:scale-110 transition-all z-10 hidden md:flex">
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#f3f4f6] pt-16 pb-8 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-8 mb-16">
          
          {/* Col 1 */}
          <div className="md:col-span-1">
            <h2 className="text-4xl font-serif font-bold text-[#403B69] mb-4">NoWayHome</h2>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Nền tảng đặt phòng và dịch vụ du lịch uy tín hàng đầu Việt Nam.
            </p>
          </div>

          {/* Col 2 */}
          <div className="md:ml-8">
            <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Về chúng tôi</h3>
            <ul className="space-y-4 text-sm text-gray-600 font-medium">
              <li><Link to="#" className="hover:text-black transition-colors">Giới thiệu</Link></li>
              <li><Link to="#" className="hover:text-black transition-colors">Tuyển dụng</Link></li>
              <li><Link to="#" className="hover:text-black transition-colors">Tin tức</Link></li>
              <li><Link to="#" className="hover:text-black transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Hỗ trợ</h3>
            <ul className="space-y-4 text-sm text-gray-600 font-medium">
              <li><Link to="#" className="hover:text-black transition-colors">Trung tâm hỗ trợ</Link></li>
              <li><Link to="#" className="hover:text-black transition-colors">Hướng dẫn đặt phòng</Link></li>
              <li><Link to="#" className="hover:text-black transition-colors">Chính sách hủy phòng</Link></li>
              <li><Link to="#" className="hover:text-black transition-colors">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Chính sách</h3>
            <ul className="space-y-4 text-sm text-gray-600 font-medium">
              <li><Link to="#" className="hover:text-black transition-colors">Điều khoản sử dụng</Link></li>
              <li><Link to="#" className="hover:text-black transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="#" className="hover:text-black transition-colors">Chính sách thanh toán</Link></li>
              <li><Link to="#" className="hover:text-black transition-colors">Chính sách hoàn/ hủy</Link></li>
            </ul>
          </div>

          {/* Col 5 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Tổng đài hỗ trợ 24/7</h3>
            <div className="flex items-center space-x-3 text-sm text-[#403B69] font-bold mb-4">
              <Phone className="w-5 h-5" />
              <span className="text-base">1900 1234</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-700 font-medium">
              <Mail className="w-5 h-5" />
              <span>support@nowayhome.vn</span>
            </div>
          </div>

        </div>

        <div className="text-center text-xs text-gray-400 font-medium border-t border-gray-200 pt-8 uppercase tracking-widest">
          © 2026 NOWAYHOME. ĐẶT PHÒNG NHANH, TRẢI NGHIỆM CHẤT.
        </div>
      </footer>

    </div>
  );
};

export default Home;
