// src/services/hotelService.js
// src/services/hotelService.js
import axiosClient from '../api/axiosClient';

export const hotelService = {
    // Lấy danh sách khách sạn kèm bộ lọc
    // Backend hỗ trợ các query như: city, star_rating, min_price, max_price, check_in, check_out, rooms_needed...
    searchHotels: (params) => {
        return axiosClient.get('/properties/search', { params });
    },

    // Lấy chi tiết khách sạn bằng slug
    getHotelDetail: (slug, params) => {
        return axiosClient.get(`/properties/${slug}`, { params });
    }
};
