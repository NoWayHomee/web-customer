import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Bell, MapPin, Star, Check, Wifi, 
  Coffee, Waves, Dumbbell, Car, Utensils,
  ArrowLeft, Snowflake, Square
} from 'lucide-react';
import { hotelsMockData } from '../../mocks/hotels';

const amenityIcons = {
  "Hồ bơi": <Waves className="w-5 h-5 text-gray-600" />,
  "Bể bơi": <Waves className="w-5 h-5 text-gray-600" />,
  "Hồ bơi vô cực": <Waves className="w-5 h-5 text-gray-600" />,
  "Spa": <Coffee className="w-5 h-5 text-gray-600" />,
  "Dịch vụ spa": <Coffee className="w-5 h-5 text-gray-600" />,
  "Nhà hàng": <Utensils className="w-5 h-5 text-gray-600" />,
  "Phòng ăn": <Utensils className="w-5 h-5 text-gray-600" />,
  "Wifi miễn phí": <Wifi className="w-5 h-5 text-gray-600" />,
  "Điều hòa": <Snowflake className="w-5 h-5 text-gray-600" />,
  "Chỗ để xe riêng": <span className="font-bold border-2 border-gray-600 w-5 h-5 flex items-center justify-center text-[10px] rounded-sm text-gray-600">P</span>,
  "Đỗ xe": <span className="font-bold border-2 border-gray-600 w-5 h-5 flex items-center justify-center text-[10px] rounded-sm text-gray-600">P</span>,
};

const RoomDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const hotel = hotelsMockData.find(h => h.id === id);

  // Sync state from URL
  const startParam = searchParams.get('startDate');
  const endParam = searchParams.get('endDate');
  const startDate = startParam && !isNaN(Date.parse(startParam)) ? new Date(startParam) : null;
  const endDate = endParam && !isNaN(Date.parse(endParam)) ? new Date(endParam) : null;
  
  const adults = parseInt(searchParams.get('adults')) || 2;
  const children = parseInt(searchParams.get('children')) || 0;
  const rooms = parseInt(searchParams.get('rooms')) || 1;

  // Calculate nights
  const nights = (startDate && endDate && endDate > startDate) 
    ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) 
    : 1;

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  const formatDate = (date) => {
    if (!date) return "Chưa chọn";
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (!hotel) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Không tìm thấy khách sạn!</div>;
  }

  const totalPrice = hotel.price * nights * rooms;

  const handleBooking = () => {
    navigate('/payment', { 
      state: { 
        hotel, 
        bookingData: { 
          startDate, 
          endDate, 
          adults, 
          children, 
          nights, 
          rooms 
        } 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white py-4 px-8 md:px-16 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50">
        <Link to="/" className="text-3xl font-bold text-[#403B69]">
          NoWayHome
        </Link>
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <span className="font-bold text-gray-800 text-lg">
                Xin chào, {user.name}!
              </span>
              <Link to="/profile" className="text-gray-800 hover:text-black transition-transform hover:scale-110">
                <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
              </Link>
              <button className="text-gray-800">
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

      <main className="max-w-[1200px] mx-auto px-6 py-6">
        {/* 1. Back link */}
        <div className="flex items-center text-sm text-gray-500 mb-6 font-medium">
          <Link to="/search-results" className="flex items-center hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Destinations
          </Link>
        </div>

        {/* 2. Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8 h-[300px] md:h-[480px]">
          <div className="md:col-span-2 rounded-l-2xl overflow-hidden h-full">
            <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:flex flex-col gap-2 h-full overflow-hidden">
            <div className="rounded-tr-2xl overflow-hidden h-1/2">
              <img src={hotel.images[1] || hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-br-2xl overflow-hidden h-1/2">
              <img src={hotel.images[2] || hotel.images[0] || hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* 3. Hotel Title & Info */}
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-[#403B69] mb-4">{hotel.name}</h1>
          <div className="flex items-center text-gray-600 text-sm space-x-4 mb-6">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-black text-black mr-1" />
              <span className="font-bold text-black mr-1">{hotel.rating === 5 ? "4.95" : "4.5"}</span>
              <span className="text-gray-500">({hotel.reviews} reviews)</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{hotel.location}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1 text-gray-400" />
              <span>Còn trống: {hotel.roomsLeft || 3} phòng</span>
            </div>
          </div>
        </div>

        {/* 4. Separator */}
        <div className="w-full border-t border-gray-200 mb-8"></div>

        {/* 5. Two-column Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12 relative">
          
          {/* Left Column: Description & Amenities */}
          <div className="flex-1">
            <div className="mb-12">
              <p className="text-gray-900 text-[16px] leading-7">
                {hotel.description}
              </p>
            </div>

            <div className="w-full border-t border-gray-100 mb-10"></div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Tiện nghi</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10">
                {hotel.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-4 text-gray-900 text-[15px]">
                    <span>
                      {amenityIcons[amenity] || <Check className="w-5 h-5 text-gray-600" />}
                    </span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Card (Sidebar) */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] border border-gray-200 sticky top-28">
              <div className="mb-8">
                <span className="text-3xl font-bold text-gray-900 tracking-tight">VND {hotel.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                <span className="text-gray-500 text-sm ml-2">/ đêm</span>
              </div>
              
              <div className="border border-gray-200 rounded-2xl overflow-hidden mb-8">
                <div className="flex border-b border-gray-200">
                  <div className="w-1/2 p-5 border-r border-gray-200 bg-white">
                    <div className="text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wider">CHECK-OUT</div>
                    <div className="text-[15px] text-gray-900 font-bold">{startDate ? startDate.toLocaleDateString('en-GB') : "25/04/2026"}</div>
                  </div>
                  <div className="w-1/2 p-5 bg-white">
                    <div className="text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wider">CHECK-IN</div>
                    <div className="text-[15px] text-gray-900 font-bold">{endDate ? endDate.toLocaleDateString('en-GB') : "26/04/2026"}</div>
                  </div>
                </div>
                <div className="p-5 bg-white">
                  <div className="text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wider">GUESTS</div>
                  <div className="text-[15px] text-gray-900 font-bold">{adults + children} người</div>
                </div>
              </div>

              <button 
                onClick={handleBooking}
                className="w-full bg-[#3F3D7C] text-white font-bold text-lg py-5 rounded-2xl shadow-lg hover:bg-[#34326b] transition-all mb-4"
              >
                Đặt phòng ngay
              </button>
              
              <div className="text-center mt-2">
                <p className="text-sm text-gray-500 font-medium">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-10 mt-16">
        <div className="text-center text-xs text-gray-400 font-medium uppercase tracking-widest">
          © 2026 NOWAYHOME. ĐẶT PHÒNG NHANH, TRẢI NGHIỆM CHẤT.
        </div>
      </footer>
    </div>
  );
};

export default RoomDetail;
