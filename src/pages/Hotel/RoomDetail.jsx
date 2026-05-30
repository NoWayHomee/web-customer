// === RoomDetail.jsx - Trang Chi tiết phòng khách sạn ===
// Hiển thị: Gallery ảnh, Tiêu đề & đánh giá, Mô tả, Tiện nghi, Booking card (thẻ đặt phòng)
// Nhận dữ liệu: hotel ID từ URL params, ngày/số khách từ query params

import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import {
  User, Bell, MapPin, Star, Check, Wifi,
  Coffee, Waves, Dumbbell, Car, Utensils,
  ArrowLeft, Snowflake, Square, Heart,
  Maximize, BedDouble, Users, Clock, Info, PawPrint, Ban
} from 'lucide-react';
import { hotelService } from '../../services/hotelService';

// === Bảng ánh xạ tên tiện nghi → icon tương ứng ===
// Dùng để hiển thị icon phù hợp bên cạnh tên tiện nghi (Hồ bơi, Wifi, Spa...)
const amenityIcons = {
  "Hồ bơi": <Waves className="w-5 h-5 text-gray-600" />,
  "Bể bơi": <Waves className="w-5 h-5 text-gray-600" />,
  "Hồ bơi vô cực": <Waves className="w-5 h-5 text-gray-600" />,
  "Swimming Pool": <Waves className="w-5 h-5 text-gray-600" />,
  "Spa": <Coffee className="w-5 h-5 text-gray-600" />,
  "Dịch vụ spa": <Coffee className="w-5 h-5 text-gray-600" />,
  "Nhà hàng": <Utensils className="w-5 h-5 text-gray-600" />,
  "Phòng ăn": <Utensils className="w-5 h-5 text-gray-600" />,
  "Restaurant": <Utensils className="w-5 h-5 text-gray-600" />,
  "Wifi miễn phí": <Wifi className="w-5 h-5 text-gray-600" />,
  "Free Wi-Fi": <Wifi className="w-5 h-5 text-gray-600" />,
  "Điều hòa": <Snowflake className="w-5 h-5 text-gray-600" />,
  "Air Conditioning": <Snowflake className="w-5 h-5 text-gray-600" />,
  "Chỗ để xe riêng": <span className="font-bold border-2 border-gray-600 w-5 h-5 flex items-center justify-center text-[10px] rounded-sm text-gray-600">P</span>,
  "Đỗ xe": <span className="font-bold border-2 border-gray-600 w-5 h-5 flex items-center justify-center text-[10px] rounded-sm text-gray-600">P</span>,
  "Free Parking": <span className="font-bold border-2 border-gray-600 w-5 h-5 flex items-center justify-center text-[10px] rounded-sm text-gray-600">P</span>,
};

const RoomDetail = () => {
  // Lấy ID khách sạn từ URL (ví dụ: /hotel/hl1 → id = "hl1")
  const { id } = useParams();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  // Lấy query params (được truyền từ trang SearchResults)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // State lưu trữ dữ liệu khách sạn từ backend
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // === Lấy thông tin ngày nhận/trả phòng từ URL ===
  const startParam = searchParams.get('startDate');
  const endParam = searchParams.get('endDate');
  const startDate = startParam && !isNaN(Date.parse(startParam)) ? new Date(startParam) : null;
  const endDate = endParam && !isNaN(Date.parse(endParam)) ? new Date(endParam) : null;

  // Lấy số lượng khách từ URL params
  const adults = parseInt(searchParams.get('adults')) || 2;
  const children = parseInt(searchParams.get('children')) || 0;
  const rooms = parseInt(searchParams.get('rooms')) || 1;

  // === Fetch dữ liệu chi tiết từ Backend ===
  useEffect(() => {
    let active = true;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {};
        if (startParam) {
          queryParams.check_in = startParam.split('T')[0];
        }
        if (endParam) {
          queryParams.check_out = endParam.split('T')[0];
        }

        const response = await hotelService.getHotelDetail(id, queryParams);
        if (active) {
          const raw = response.data;

          // Ánh xạ đối tượng Property từ backend sang cấu trúc UI
          const mapped = {
            id: raw.slug,
            name: raw.name,
            slug: raw.slug,
            type: raw.propertyType === 'hotel' || raw.property_type === 'hotel' ? 'Khách sạn' : raw.propertyType === 'resort' || raw.property_type === 'resort' ? 'Resort' : 'Biệt thự',
            description: raw.description || "Chưa có mô tả chi tiết.",
            location: `${raw.address || ''}${raw.district ? `, ${raw.district}` : ''}, ${raw.city || ''}`,
            rating: raw.starRating || 4,
            reviews: raw.totalReviews || 12,

            // Map danh sách ảnh
            images: raw.media?.length > 0
              ? raw.media.map(m => m.url)
              : ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'],
            image: raw.media?.find(m => m.isCover)?.url || raw.media?.[0]?.url || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',

            // Map danh sách tiện nghi
            amenities: raw.amenities?.length > 0
              ? raw.amenities.map(a => a.amenity?.name)
              : ["Free Wi-Fi", "Swimming Pool", "Air Conditioning", "Restaurant"],

            // Tính toán giá từ các loại phòng (chọn giá thấp nhất)
            price: raw.roomTypes?.length > 0
              ? Math.min(...raw.roomTypes.map(rt => Number(rt.total_price || rt.basePrice || 0)))
              : 850000,

            roomsLeft: raw.roomTypes?.reduce((sum, rt) => sum + (rt.min_available_qty || rt.totalRooms || 0), 0) || 5
          };

          setHotel(mapped);
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết khách sạn từ Backend:", err);
        if (active) {
          setError("Không thể tải chi tiết khách sạn từ server.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchDetail();
    }
    return () => {
      active = false;
    };
  }, [id, startParam, endParam]);

  // === Tính số đêm lưu trú ===
  // Nếu có ngày hợp lệ → tính chênh lệch, nếu không → mặc định 1 đêm
  const nights = (startDate && endDate && endDate > startDate)
    ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
    : 1;

  // Hàm định dạng giá tiền (ví dụ: 2500000 → "2.500.000 ₫")
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  // Hàm định dạng ngày (ví dụ: Date → "25/04/2026")
  const formatDate = (date) => {
    if (!date) return "Chưa chọn";
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Nếu đang loading hiển thị loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-[#403B69]">
        <div className="w-12 h-12 border-4 border-[#403B69] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-semibold">Đang tải thông tin chi tiết khách sạn từ Backend...</p>
      </div>
    );
  }

  // Nếu có lỗi hoặc không tìm thấy khách sạn tương ứng → hiển thị thông báo lỗi
  if (error || !hotel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-red-600 font-semibold p-6 text-center">
        <p className="text-xl mb-4">{error || "Không tìm thấy thông tin khách sạn!"}</p>
        <Link to="/search-results" className="text-[#403B69] hover:underline font-bold">
          Quay lại danh sách tìm kiếm
        </Link>
      </div>
    );
  }

  // Tính tổng giá = giá/đêm × số đêm × số phòng
  const totalPrice = hotel.price * nights * rooms;

  // Hàm xử lý đặt phòng: Chuyển sang trang thanh toán và truyền dữ liệu qua React Router state
  const handleBooking = () => {
    // Kiểm tra đăng nhập trước khi cho phép đặt phòng
    if (!user) {
      alert('Vui lòng đăng nhập để tiếp tục đặt phòng!');
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }

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
      {/* ===== HEADER: Thanh điều hướng - cố định trên cùng ===== */}
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
        {/* 1. Link quay lại trang kết quả tìm kiếm */}
        <div className="flex items-center text-sm text-gray-500 mb-6 font-medium">
          <Link to="/search-results" className="flex items-center hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Destinations
          </Link>
        </div>

        {/* 2. Gallery ảnh: Ảnh chính lớn bên trái (2/3), 2 ảnh nhỏ bên phải (1/3) */}
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

        {/* 3. Tiêu đề, đánh giá sao, địa điểm, số phòng còn trống */}
        <div className="mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h1 className="text-4xl font-bold text-[#403B69]">{hotel.name}</h1>
            <button
              onClick={() => toggleWishlist(hotel)}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-sm shrink-0 self-start md:self-auto ${isInWishlist(hotel.id)
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-300 ${isInWishlist(hotel.id) ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-500'
                  }`}
              />
              <span>{isInWishlist(hotel.id) ? 'Đã yêu thích' : 'Lưu vào yêu thích'}</span>
            </button>
          </div>
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

        {/* 5. Bố cục 2 cột: Mô tả & Tiện nghi (trái) | Thẻ đặt phòng (phải) */}
        <div className="flex flex-col lg:flex-row gap-12 relative">

          {/* === CỘT TRÁI: Các thông tin chi tiết của khách sạn === */}
          <div className="flex-1 space-y-12">

            {/* 1. Tổng quan */}
            <div>
              <h2 className="text-[22px] font-bold text-gray-900 mb-6 font-serif">Tổng quan</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#f8f9fa] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-[#e8eaf6] rounded-full flex items-center justify-center mb-3 text-[#3F3D7C]">
                    <Maximize className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Diện tích</div>
                  <div className="font-bold text-gray-900">29 m²</div>
                </div>
                <div className="bg-[#f8f9fa] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-[#e8eaf6] rounded-full flex items-center justify-center mb-3 text-[#3F3D7C]">
                    <BedDouble className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Loại giường</div>
                  <div className="font-bold text-gray-900 text-sm">1 giường đôi</div>
                </div>
                <div className="bg-[#f8f9fa] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-[#e8eaf6] rounded-full flex items-center justify-center mb-3 text-[#3F3D7C]">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-500 mb-1">Số người</div>
                  <div className="font-bold text-gray-900">Tối đa 2</div>
                </div>
              </div>
            </div>

            <div className="w-full border-t border-gray-100"></div>

            {/* 2. Mô tả */}
            <div>
              <h2 className="text-[22px] font-bold text-gray-900 mb-6 font-serif">Mô tả</h2>
              <div className="bg-[#f8f9fa] rounded-2xl p-6">
                <p className="text-gray-600 text-[15px] leading-relaxed mb-4 whitespace-pre-line">
                  {hotel.description.length > 200 && !isDescExpanded
                    ? hotel.description.substring(0, 200) + '...'
                    : hotel.description}
                </p>
                {hotel.description.length > 200 && (
                  <button
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="text-[#3F3D7C] font-bold text-sm hover:underline"
                  >
                    {isDescExpanded ? 'Thu gọn' : 'Đọc thêm'}
                  </button>
                )}
              </div>
            </div>

            <div className="w-full border-t border-gray-100"></div>

            {/* 3. Tiện nghi */}
            <div>
              <h2 className="text-[22px] font-bold text-gray-900 mb-6 font-serif">Tiện nghi</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8">
                {hotel.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-gray-900 text-[15px]">
                    <span>
                      {amenityIcons[amenity] || <Check className="w-5 h-5 text-gray-600" />}
                    </span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full border-t border-gray-100"></div>

            {/* 4. Kết nối giao thông */}
            <div>
              <h2 className="text-[22px] font-bold text-gray-900 mb-6 font-serif">Kết nối giao thông</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-[#3F3D7C]" />
                    <span>trung tâm thành phố</span>
                  </div>
                  <span className="text-gray-500 text-sm">200 m</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-[#3F3D7C]" />
                    <span>Nha Tu Hoa Lo</span>
                  </div>
                  <span className="text-gray-500 text-sm">310 m</span>
                </div>
              </div>
            </div>

            <div className="w-full border-t border-gray-100"></div>

            {/* 5. Địa điểm lân cận */}
            <div>
              <h2 className="text-[22px] font-bold text-gray-900 mb-6 font-serif">Địa điểm lân cận</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-[#3F3D7C]" />
                    <span>SHB</span>
                  </div>
                  <span className="text-gray-500 text-sm">111 m</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-[#3F3D7C]" />
                    <span>Cơm Chay Nàng Tấm</span>
                  </div>
                  <span className="text-gray-500 text-sm">143 m</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-700">
                    <Utensils className="w-5 h-5 mr-3 text-[#3F3D7C]" />
                    <span>Nhà Hàng Chay Phương Nam</span>
                  </div>
                  <span className="text-gray-500 text-sm">149 m</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-[#3F3D7C]" />
                    <span>Techcombank</span>
                  </div>
                  <span className="text-gray-500 text-sm">150 m</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-700">
                    <Coffee className="w-5 h-5 mr-3 text-[#3F3D7C]" />
                    <span>Orick Coffee</span>
                  </div>
                  <span className="text-gray-500 text-sm">154 m</span>
                </div>
              </div>
            </div>

            <div className="w-full border-t border-gray-100"></div>

            {/* 6. Chính sách lưu trú */}
            <div>
              <h2 className="text-[22px] font-bold text-gray-900 mb-6 font-serif">Chính sách lưu trú</h2>
              <div className="bg-[#f8f9fa] rounded-2xl p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-5 h-5 mr-3" />
                    <span>Nhận phòng</span>
                  </div>
                  <span className="font-bold text-gray-900">Từ 06:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-5 h-5 mr-3" />
                    <span>Trả phòng</span>
                  </div>
                  <span className="font-bold text-gray-900">Trước 04:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-500">
                    <Info className="w-5 h-5 mr-3" />
                    <span>Hủy phòng</span>
                  </div>
                  <span className="font-bold text-gray-900">Miễn phí hủy</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-500">
                    <PawPrint className="w-5 h-5 mr-3" />
                    <span>Vật nuôi</span>
                  </div>
                  <span className="font-bold text-gray-900">Cho phép mang theo</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-500">
                    <Ban className="w-5 h-5 mr-3" />
                    <span>Hút thuốc</span>
                  </div>
                  <span className="font-bold text-gray-900">Được phép ở khu quy định</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-500">
                    <Users className="w-5 h-5 mr-3" />
                    <span>Trẻ em</span>
                  </div>
                  <span className="font-bold text-gray-900">Chào đón trẻ em</span>
                </div>
              </div>
            </div>

            <div className="w-full border-t border-gray-100"></div>

            {/* 7. Các loại phòng trống */}
            <div>
              <h2 className="text-[22px] font-bold text-gray-900 mb-6 font-serif">Các loại phòng trống</h2>
              <div className="space-y-4">
                {/* Room 1 */}
                <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Studio Tiêu Chuẩn (Standard Studio)</h3>
                  <div className="flex items-center text-gray-500 text-sm space-x-3 mb-2">
                    <div className="flex items-center"><Maximize className="w-4 h-4 mr-1" /> 29 m²</div>
                    <span>•</span>
                    <div className="flex items-center"><BedDouble className="w-4 h-4 mr-1" /> 1 giường đôi</div>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-6">
                    <Users className="w-4 h-4 mr-1" /> Phù hợp cho 2 người
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                    <div>
                      <div className="text-[#3F3D7C] text-2xl font-bold">3.000.000 đ</div>
                      <div className="text-gray-500 text-sm">/ đêm</div>
                    </div>
                    <button className="bg-[#3F3D7C] text-white font-bold py-2.5 px-6 rounded-xl hover:bg-[#34326b] transition-all">
                      Chọn phòng
                    </button>
                  </div>
                </div>

                {/* Room 2 */}
                <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Deluxe Room</h3>
                  <div className="flex items-center text-gray-500 text-sm space-x-3 mb-2">
                    <div className="flex items-center"><Maximize className="w-4 h-4 mr-1" /> 30 m²</div>
                    <span>•</span>
                    <div className="flex items-center"><BedDouble className="w-4 h-4 mr-1" /> 3 giường</div>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-6">
                    <Users className="w-4 h-4 mr-1" /> Phù hợp cho 2 người
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                    <div>
                      <div className="text-[#3F3D7C] text-2xl font-bold">15.000.000 đ</div>
                      <div className="text-gray-500 text-sm">/ đêm</div>
                    </div>
                    <button className="bg-[#3F3D7C] text-white font-bold py-2.5 px-6 rounded-xl hover:bg-[#34326b] transition-all">
                      Chọn phòng
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* === CỘT PHẢI: Thẻ đặt phòng (Booking Card) ===
              Hiển thị: Giá/đêm, Ngày check-in/out, Số khách, Nút đặt phòng
              sticky: cố định khi cuộn trang */}
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

      {/* ===== FOOTER ===== */}
      <footer className="bg-white border-t border-gray-100 py-10 mt-16">
        <div className="text-center text-xs text-gray-400 font-medium uppercase tracking-widest">
          © 2026 NOWAYHOME. ĐẶT PHÒNG NHANH, TRẢI NGHIỆM CHẤT.
        </div>
      </footer>
    </div>
  );
};

export default RoomDetail;
