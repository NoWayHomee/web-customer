// src/services/hotelService.js
import { hotelsMockData } from '../mocks/hotels';

export const hotelService = {
    // Lấy danh sách khách sạn kèm bộ lọc
    searchHotels: (params) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const items = hotelsMockData.map(h => ({
                    slug: h.id,
                    name: h.name,
                    property_type: h.type === 'Resort' ? 'resort' : 'hotel',
                    cover_image: h.image,
                    star_rating: h.rating,
                    address: h.location,
                    district: h.area,
                    city: h.area,
                    total_reviews: h.reviews,
                    min_nightly_price: h.price,
                    avg_rating: h.guestRating
                }));
                resolve({
                    data: {
                        data: {
                            items
                        }
                    }
                });
            }, 300);
        });
    },

    // Lấy chi tiết khách sạn bằng slug
    getHotelDetail: (slug, params) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const hotel = hotelsMockData.find(h => h.id === slug || h.slug === slug);
                if (hotel) {
                    const rawHotel = {
                        slug: hotel.id,
                        name: hotel.name,
                        propertyType: hotel.type === 'Resort' ? 'resort' : 'hotel',
                        description: hotel.description,
                        address: hotel.location,
                        district: '',
                        city: hotel.area,
                        starRating: hotel.rating,
                        totalReviews: hotel.reviews,
                        media: hotel.images ? hotel.images.map((img, i) => ({ url: img, isCover: i === 0 })) : [{ url: hotel.image, isCover: true }],
                        amenities: hotel.amenities ? hotel.amenities.map(a => ({ amenity: { name: a } })) : [],
                        roomTypes: [
                            {
                                basePrice: hotel.price,
                                min_available_qty: hotel.roomsLeft || 3
                            }
                        ]
                    };
                    resolve({ data: rawHotel });
                } else {
                    reject(new Error("Hotel not found"));
                }
            }, 300);
        });
    }
};
