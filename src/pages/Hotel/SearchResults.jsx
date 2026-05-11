import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../../context/AuthContext';
import { 
  User, Bell, MapPin, Calendar, Search, 
  Star, Map, Filter, ChevronDown, Check
} from 'lucide-react';
import { hotelsMockData } from '../../mocks/hotels';

const SearchResults = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const locationParam = searchParams.get('location') || '';
  
  // Parse dates
  const startParam = searchParams.get('startDate');
  const endParam = searchParams.get('endDate');
  // Handle invalid date strings safely
  const initialStartDate = startParam && !isNaN(Date.parse(startParam)) ? new Date(startParam) : null;
  const initialEndDate = endParam && !isNaN(Date.parse(endParam)) ? new Date(endParam) : null;
  
  // Parse guests
  const adultsParam = parseInt(searchParams.get('adults')) || 2;
  const childrenParam = parseInt(searchParams.get('children')) || 0;
  const roomsParam = parseInt(searchParams.get('rooms')) || 1;

  // Search Bar States
  const [locationInput, setLocationInput] = useState(locationParam);
  const [dateRange, setDateRange] = useState([initialStartDate, initialEndDate]);
  const [startDate, endDate] = dateRange;
  
  const [showGuestPopover, setShowGuestPopover] = useState(false);
  const [guests, setGuests] = useState({ adults: adultsParam, children: childrenParam, rooms: roomsParam });

  // Update input if URL changes (e.g. going back)
  useEffect(() => {
    setLocationInput(locationParam);
    // Note: useEffect dependencies can be tricky with object references, so we avoid resetting date unless needed, but for simplicity here:
    setDateRange([initialStartDate, initialEndDate]);
    setGuests({ adults: adultsParam, children: childrenParam, rooms: roomsParam });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationParam, startParam, endParam, searchParams.get('adults'), searchParams.get('children'), searchParams.get('rooms')]);

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
    if (locationInput) params.append('location', locationInput);
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    params.append('adults', guests.adults);
    params.append('children', guests.children);
    params.append('rooms', guests.rooms);
    
    setSearchParams(params);
  };
  
  const [sortBy, setSortBy] = useState('Độ phổ biến');
  
  // Filter states
  const [selectedStars, setSelectedStars] = useState([]);
  const [priceRange, setPriceRange] = useState([]);

  const sortOptions = ["Độ phổ biến", "Khuyến mãi HOT", "Giá từ thấp đến cao", "Giá từ cao đến thấp"];

  const handleStarToggle = (star) => {
    setSelectedStars(prev => 
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const handlePriceToggle = (range) => {
    setPriceRange(prev => 
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  // Hàm loại bỏ dấu tiếng Việt để tìm kiếm chính xác hơn
  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  };

  // Lọc và sắp xếp dữ liệu
  const filteredAndSortedHotels = useMemo(() => {
    let result = [...hotelsMockData];

    // Lọc theo địa điểm
    if (locationParam) {
      const searchStr = removeDiacritics(locationParam);
      result = result.filter(hotel => 
        removeDiacritics(hotel.location).includes(searchStr) ||
        removeDiacritics(hotel.name).includes(searchStr)
      );
    }

    // Lọc theo sao
    if (selectedStars.length > 0) {
      result = result.filter(hotel => selectedStars.includes(hotel.rating));
    }

    // Lọc theo giá
    if (priceRange.length > 0) {
      result = result.filter(hotel => {
        const p = hotel.price;
        if (priceRange.includes('under1m') && p < 1000000) return true;
        if (priceRange.includes('1m_to_2m') && p >= 1000000 && p <= 2000000) return true;
        if (priceRange.includes('above2m') && p > 2000000) return true;
        return false;
      });
    }

    // Sắp xếp
    switch (sortBy) {
      case "Giá từ thấp đến cao":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Giá từ cao đến thấp":
        result.sort((a, b) => b.price - a.price);
        break;
      case "Khuyến mãi HOT":
        // Ưu tiên những phòng có tag "Khuyến mãi HOT"
        result.sort((a, b) => (a.tag === "Khuyến mãi HOT" ? -1 : 1));
        break;
      case "Độ phổ biến":
      default:
        // Sắp xếp theo số lượng đánh giá giảm dần
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return result;
  }, [selectedStars, priceRange, sortBy, locationParam]);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white py-4 px-8 md:px-16 flex justify-between items-center border-b border-gray-200 sticky top-0 z-50">
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

      {/* Simplified Search Bar at top */}
      <div className="bg-[#403B69] py-6 px-8 md:px-16 shadow-md">
        <div className="max-w-[1200px] mx-auto bg-white rounded-xl shadow-lg p-2 flex flex-col md:flex-row gap-2 items-center">
          
          <div className="flex-1 w-full p-2 flex items-center bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-500 mr-2" />
            <input 
              type="text" 
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Bạn muốn đi đâu" 
              className="text-sm font-medium text-gray-800 outline-none w-full bg-transparent" 
            />
          </div>
          
          <div className="flex-1 w-full p-2 flex items-center bg-gray-50 rounded-lg relative cursor-pointer">
            <Calendar className="w-5 h-5 text-gray-500 mr-2" />
            <div className="flex-1">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                placeholderText="Nhận phòng - Trả phòng"
                className="text-sm font-medium text-gray-800 outline-none w-full bg-transparent cursor-pointer"
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
              />
            </div>
          </div>
          
          <div 
            className="flex-1 w-full p-2 flex items-center bg-gray-50 rounded-lg relative cursor-pointer"
            onClick={() => setShowGuestPopover(!showGuestPopover)}
          >
            <User className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-800 flex-1">{guests.adults} người lớn, {guests.children} trẻ em, {guests.rooms} phòng</span>
            
            {/* Guest Popover */}
            {showGuestPopover && (
              <div className="absolute top-[calc(100%+12px)] left-0 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-5 z-50 cursor-default" onClick={e => e.stopPropagation()}>
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
          
          <button onClick={handleSearch} className="px-8 py-3 rounded-lg bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors">
            Tìm kiếm
          </button>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Filters */}
        <aside className="w-full md:w-1/4 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-gray-100">
              <Filter className="w-5 h-5 text-[#403B69]" />
              <h2 className="font-bold text-lg text-gray-900">Bộ lọc tìm kiếm</h2>
            </div>

            {/* Giá phòng */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Mức giá (1 đêm)</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${priceRange.includes('under1m') ? 'bg-[#403B69] border-[#403B69]' : 'border-gray-300 group-hover:border-[#403B69]'}`}>
                    {priceRange.includes('under1m') && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={priceRange.includes('under1m')} onChange={() => handlePriceToggle('under1m')} />
                  <span className="text-sm text-gray-700 font-medium">Dưới 1.000.000 ₫</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${priceRange.includes('1m_to_2m') ? 'bg-[#403B69] border-[#403B69]' : 'border-gray-300 group-hover:border-[#403B69]'}`}>
                    {priceRange.includes('1m_to_2m') && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={priceRange.includes('1m_to_2m')} onChange={() => handlePriceToggle('1m_to_2m')} />
                  <span className="text-sm text-gray-700 font-medium">1.000.000 ₫ - 2.000.000 ₫</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${priceRange.includes('above2m') ? 'bg-[#403B69] border-[#403B69]' : 'border-gray-300 group-hover:border-[#403B69]'}`}>
                    {priceRange.includes('above2m') && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={priceRange.includes('above2m')} onChange={() => handlePriceToggle('above2m')} />
                  <span className="text-sm text-gray-700 font-medium">Trên 2.000.000 ₫</span>
                </label>
              </div>
            </div>

            {/* Hạng sao */}
            <div className="mb-2">
              <h3 className="font-bold text-gray-800 mb-4">Hạng sao</h3>
              <div className="space-y-3">
                {[5, 4, 3].map(star => (
                  <label key={star} className="flex items-center space-x-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedStars.includes(star) ? 'bg-[#403B69] border-[#403B69]' : 'border-gray-300 group-hover:border-[#403B69]'}`}>
                      {selectedStars.includes(star) && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={selectedStars.includes(star)} onChange={() => handleStarToggle(star)} />
                    <div className="flex items-center space-x-1">
                      {[...Array(star)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Main Content - Results */}
        <div className="flex-1">
          
          {/* Sorting Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row items-center justify-between">
            <h1 className="font-bold text-xl text-gray-800 mb-4 md:mb-0">
              Tìm thấy <span className="text-orange-500">{filteredAndSortedHotels.length}</span> chỗ nghỉ
            </h1>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 font-medium mr-2">Sắp xếp theo:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {sortOptions.map(option => (
                  <button 
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${sortBy === option ? 'bg-white text-[#403B69] shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hotel List */}
          <div className="space-y-6">
            {filteredAndSortedHotels.length > 0 ? (
              filteredAndSortedHotels.map(hotel => (
                <Link to={`/hotel/${hotel.id}?${searchParams.toString()}`} key={hotel.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow block">
                  {/* Image */}
                  <div className="w-full md:w-[280px] h-60 md:h-auto relative flex-shrink-0">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                    {hotel.tag && (
                      <div className="absolute top-4 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-r-lg shadow-sm">
                        {hotel.tag}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase">{hotel.type}</span>
                          <div className="flex">
                            {[...Array(hotel.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2 hover:text-[#403B69] cursor-pointer transition-colors">{hotel.name}</h2>
                        <div className="flex items-center text-gray-500 text-sm mb-4">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate max-w-[200px] md:max-w-xs">{hotel.location}</span>
                          <button className="text-blue-600 font-medium ml-2 hover:underline flex-shrink-0">Xem bản đồ</button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end text-right ml-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-600 hidden md:inline">{hotel.reviews} đánh giá</span>
                          <div className="bg-[#403B69] text-white font-bold w-8 h-8 rounded flex items-center justify-center">
                            9.0
                          </div>
                        </div>
                        <span className="text-xs text-blue-600 font-medium hidden md:block">Tuyệt vời</span>
                      </div>
                    </div>

                    <div className="flex-1 hidden md:block">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.map((amenity, idx) => (
                          <span key={idx} className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md font-medium border border-gray-200">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-auto">
                      <div className="text-green-600 text-sm font-medium flex items-center">
                        <Check className="w-4 h-4 mr-1" /> <span className="hidden md:inline">Miễn phí hủy phòng</span><span className="md:hidden">Hủy miễn phí</span>
                      </div>
                      <div className="text-right">
                        {hotel.originalPrice > hotel.price && (
                          <div className="text-sm text-gray-400 line-through mb-0.5">
                            {formatPrice(hotel.originalPrice)}
                          </div>
                        )}
                        <div className="text-2xl font-bold text-orange-500 mb-2">
                          {formatPrice(hotel.price)}
                        </div>
                        <button className="bg-orange-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm w-full md:w-auto text-sm md:text-base">
                          Chọn phòng
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy chỗ nghỉ phù hợp</h3>
                <p className="text-gray-500">Vui lòng thay đổi bộ lọc hoặc tiêu chí tìm kiếm để xem thêm kết quả.</p>
                <button 
                  onClick={() => { setSelectedStars([]); setPriceRange([]); }}
                  className="mt-6 text-[#403B69] font-bold hover:underline"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default SearchResults;
