import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/Axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave } from 'react-icons/fa';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
            } catch (err) {
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
    if (!user) {
        navigate('/login');
        return;
    }

    setBookingLoading(true);
    setError('');
    setSuccessMsg('');

    try {
        // ✅ FIX 1: Path ko '/booking' kar diya (Singular as per server.js)
        // ✅ FIX 2: Key name 'productId' set kar diya
        const response = await api.post('/bookings', { 
            productId: product._id 
        });

        setSuccessMsg(response.data.message || 'Booking requested! Awaiting admin confirmation.');
        
        // Update local seats count dynamically after booking
        setProduct((prevEvent) => ({
            ...prevEvent,
            availableSeats: Math.max(0, prevEvent.availableSeats - 1)
        }));

    } catch (err) {
        setError(err.response?.data?.message || 'Booking failed');
    } finally {
        setBookingLoading(false);
    }
};

    if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading...</div>;
    if (error && !product) return <div className="text-center py-20 text-xl text-red-500">{error || 'Event not found'}</div>;

    const isSoldOut = product.availableSeats <= 0;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
            {product.image ? (
                <img src={product.image} alt={product.title} className="w-full h-80 object-cover" />
            ) : (
                <div className="w-full h-64 bg-gray-900 flex items-center justify-center text-white/50 text-6xl font-black uppercase tracking-widest">
                    {product.category}
                </div>
            )}

            <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                    <div>
                        <div className="inline-block bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                            {product.category}
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.title}</h1>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">{product.description}</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 min-w-[300px] w-full md:w-auto shrink-0 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Booking Details</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                    <FaMoneyBillWave />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase">Ticket Price</p>
                                    <p className="font-bold text-gray-800 text-lg">
                                        {product.ticketPrice === 0 ? <span className="text-green-500">Free</span> : `₹${product.ticketPrice}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                    <FaChair />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase">Availability</p>
                                    <p className="font-bold text-gray-800">
                                        <span className={product.availableSeats < 10 ? 'text-orange-500' : ''}>{product.availableSeats}</span> / {product.totalSeats}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                    <FaCalendarAlt />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase">Date</p>
                                    <p className="font-bold text-gray-800">{new Date(product.date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase">Location</p>
                                    <p className="font-bold text-gray-800">{product.location}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={isSoldOut || bookingLoading || Boolean(successMsg)}
                            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition shadow-lg ${
                                isSoldOut || successMsg
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-900 hover:bg-black text-white hover:shadow-xl hover:-translate-y-1'
                            }`}
                        >
                            {bookingLoading 
                                ? 'Processing...' 
                                : successMsg 
                                    ? 'Request Sent' 
                                    : isSoldOut 
                                        ? 'Sold Out' 
                                        : 'Confirm Registration'
                            }
                        </button>

                        {error && <p className="text-red-500 mt-4 text-center font-medium bg-red-50 p-2 rounded">{error}</p>}
                        {successMsg && <p className="text-green-600 mt-4 text-center font-medium bg-green-50 p-2 rounded">{successMsg}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;