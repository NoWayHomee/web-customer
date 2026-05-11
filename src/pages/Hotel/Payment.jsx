import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  User, Bell, CreditCard, Wallet, Landmark, 
  X, CheckCircle, Calendar, Users, ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import qrCodeImg from '../../assets/images/qr-code.png';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Data passed from RoomDetail
  const { hotel, bookingData } = location.state || {
    hotel: {
      name: "Halong Elegance",
      price: 3200000,
      images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"],
      location: "Hạ Long, Quảng Ninh"
    },
    bookingData: {
      startDate: new Date("2026-04-25"),
      endDate: new Date("2026-04-26"),
      adults: 2,
      children: 0,
      nights: 1,
      rooms: 1
    }
  };

  const [contactInfo, setContactInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const serviceFee = 1200000;
  const taxRate = 0.1;
  const subtotal = hotel.price * bookingData.nights * bookingData.rooms;
  const tax = subtotal * taxRate;
  const total = subtotal + serviceFee + tax;

  const formatPrice = (price) => {
    return "đ" + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getDate()} - ${d.getDate() + 1} Thg ${d.getMonth() + 1}, ${d.getFullYear()}`;
  };

  const handleConfirmPayment = () => {
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 relative">
      {/* Header */}
      <header className="bg-white py-4 px-8 md:px-16 flex justify-between items-center border-b border-gray-100 sticky top-0 z-40">
        <Link to="/" className="text-3xl font-bold text-[#403B69]">
          NoWayHome
        </Link>
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <span className="font-bold text-gray-800 text-lg">
                Xin chào, {user.name}!
              </span>
              <button className="text-gray-800">
                <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
              </button>
              <button className="text-gray-800">
                <Bell className="w-6 h-6" />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
               <span className="font-bold text-gray-800 text-lg">Xin chào, Khách!</span>
               <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-[#403B69] mb-12">Thanh toán</h1>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column */}
          <div className="flex-1">
            {/* Contact Info */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-[#403B69] mb-6">Thông tin liên hệ</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên</label>
                  <input 
                    type="text" 
                    placeholder="Nhập họ và tên trên giấy tờ"
                    className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#3F3D7C] outline-none"
                    value={contactInfo.fullName}
                    onChange={(e) => setContactInfo({...contactInfo, fullName: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      placeholder="example@email.com"
                      className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#3F3D7C] outline-none"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại</label>
                    <input 
                      type="text" 
                      placeholder="+84 000 000 000"
                      className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#3F3D7C] outline-none"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-xl font-bold text-[#403B69] mb-6">Phương thức thanh toán</h2>
              <div className="space-y-3">
                <PaymentOption 
                  id="credit_card"
                  label="Thẻ Tín Dụng / Ghi Nợ"
                  sublabel="Visa, Mastercard, Amex, JCB"
                  icon={<CreditCard className="w-5 h-5" />}
                  selected={paymentMethod === 'credit_card'}
                  onClick={() => setPaymentMethod('credit_card')}
                />
                <PaymentOption 
                  id="momo"
                  label="Ví điện tử MoMo"
                  icon={<Wallet className="w-5 h-5" />}
                  selected={paymentMethod === 'momo'}
                  onClick={() => setPaymentMethod('momo')}
                />
                <PaymentOption 
                  id="zalopay"
                  label="Ví điện tử ZaloPay"
                  icon={<Wallet className="w-5 h-5" />}
                  selected={paymentMethod === 'zalopay'}
                  onClick={() => setPaymentMethod('zalopay')}
                />
                <PaymentOption 
                  id="bank_transfer"
                  label="Chuyển khoản ngân hàng"
                  icon={<Landmark className="w-5 h-5" />}
                  selected={paymentMethod === 'bank_transfer'}
                  onClick={() => setPaymentMethod('bank_transfer')}
                />
              </div>

              {/* Credit Card Form */}
              {paymentMethod === 'credit_card' && (
                <div className="mt-8 space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Số thẻ</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="0000 0000 0000 0000"
                          className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#3F3D7C] outline-none pr-12"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-1">
                          <div className="w-6 h-4 bg-gray-300 rounded-sm"></div>
                          <div className="w-6 h-4 bg-gray-400 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Ngày hết hạn</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#3F3D7C] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                      <input 
                        type="password" 
                        placeholder="123"
                        className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#3F3D7C] outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Tên trên thẻ</label>
                      <input 
                        type="text" 
                        placeholder="NGUYEN VAN A"
                        className="w-full bg-[#F3F4F6] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#3F3D7C] outline-none uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* QR Code Simulation */}
              {(paymentMethod === 'momo' || paymentMethod === 'zalopay' || paymentMethod === 'bank_transfer') && (
                <div className="mt-8 flex flex-col items-center animate-fadeIn">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <img src={qrCodeImg} alt="QR Code" className="w-48 h-48 object-contain" />
                  </div>
                  <p className="mt-4 text-center font-bold text-gray-800 uppercase tracking-wide">
                    {paymentMethod === 'bank_transfer' ? (
                      <>
                        NGUYEN THUY DUONG<br />
                        TP Bank<br />
                        1234 567 890
                      </>
                    ) : (
                      `QUÉT MÃ ĐỂ THANH TOÁN ${paymentMethod.toUpperCase()}`
                    )}
                  </p>
                </div>
              )}
              
              <p className="mt-6 text-[11px] text-gray-500">
                Bằng việc tiếp tục, bạn đồng ý với <span className="underline cursor-pointer">Điều khoản dịch vụ</span> và <span className="underline cursor-pointer">Chính sách bảo mật</span> của chúng tôi.
              </p>
            </section>
          </div>

          {/* Right Column (Price Summary Card) */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 sticky top-32">
              <div className="p-4">
                <img 
                  src={hotel.images[0]} 
                  alt={hotel.name} 
                  className="w-full h-48 object-cover rounded-2xl"
                />
              </div>
              <div className="px-8 pb-8">
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">TOÀN BỘ CĂN HỘ</p>
                  <h3 className="text-2xl font-bold text-[#403B69]">{hotel.name}</h3>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-3" />
                    <span>{formatDate(bookingData.startDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-3" />
                    <span>{bookingData.adults + bookingData.children} khách</span>
                    <span className="mx-3 text-gray-300">•</span>
                    <span>{bookingData.nights} đêm</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 mb-8">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">CHI TIẾT GIÁ</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{formatPrice(hotel.price)} × {bookingData.nights}</span>
                      <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 underline">Phí dịch vụ</span>
                      <span className="font-medium text-gray-900">{formatPrice(serviceFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thuế (10%)</span>
                      <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Tổng cộng (VND)</p>
                    <p className="text-[10px] text-gray-400 italic">Bao gồm mọi khoản thuế phí</p>
                  </div>
                  <p className="text-3xl font-bold text-[#403B69] tracking-tight">
                    {formatPrice(total).replace("đ", "₫")}
                  </p>
                </div>

                <button 
                  onClick={handleConfirmPayment}
                  className="w-full bg-[#3F3D7C] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#34326b] transition-all transform active:scale-95"
                >
                  Xác nhận thanh toán
                </button>
                
                <div className="flex items-center justify-center mt-6 text-gray-400 space-x-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[11px] font-medium">Thanh toán an toàn & bảo mật</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-[600px] p-12 relative z-10 shadow-2xl animate-scaleIn">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                🎉 Chúc mừng bạn, chuyến đi đã sẵn sàng!
              </h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>Mọi thứ đã được xác nhận.</p>
                <p>
                  Chúng tôi vừa gửi thông tin chi tiết qua email <span className="font-bold italic">{contactInfo.email || "nguyenvan@example.com"}</span>.
                </p>
                <p>Mã đặt phòng: <span className="font-bold">#WANDER-9981</span></p>
                <p className="flex items-center">
                  Trạng thái: <span className="font-bold ml-2">Đã thanh toán</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}} />
    </div>
  );
};

const PaymentOption = ({ id, label, sublabel, icon, selected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
        ${selected ? 'border-[#3F3D7C] bg-[#F0F0FF]' : 'border-gray-100 hover:border-gray-200'}
      `}
    >
      <div className="flex items-center space-x-4">
        <div className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${selected ? 'border-[#3F3D7C]' : 'border-gray-300'}
        `}>
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#3F3D7C]" />}
        </div>
        <div>
          <p className="font-bold text-sm text-gray-900">{label}</p>
          {sublabel && <p className="text-[11px] text-gray-500">{sublabel}</p>}
        </div>
      </div>
      <div className="text-gray-400">
        {icon}
      </div>
    </div>
  );
};

export default Payment;
