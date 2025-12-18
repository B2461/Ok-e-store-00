
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types';
import Card from './Card';
import { useAppContext } from '../App';

interface OrderHistoryScreenProps {
    orders: Order[];
}

const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ orders }) => {
    const { isAuthenticated, currentUser, showAuth, t, isPremiumActive } = useAppContext();

    // Calculate days remaining for premium
    const daysLeft = useMemo(() => {
        if (!currentUser?.subscriptionExpiry) return 0;
        const now = new Date();
        const expiry = new Date(currentUser.subscriptionExpiry);
        const diffTime = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }, [currentUser]);

    if (!isAuthenticated || !currentUser) {
        return (
            <Card className="animate-fade-in max-w-2xl mx-auto text-center">
                <Link to="/" className="absolute top-6 left-6 text-purple-300 hover:text-white transition">&larr; {t('back')}</Link>
                <h2 className="text-3xl font-hindi font-bold mb-4">{t('my_orders')}</h2>
                <p className="text-purple-200 text-lg mb-6">अपने ऑर्डर और सदस्यता स्थिति देखने के लिए कृपया लॉगिन करें।</p>
                <button
                    onClick={() => showAuth()}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out text-lg"
                >
                    लॉगिन करें
                </button>
            </Card>
        );
    }

    // Helper to normalize phone numbers (take last 10 digits only) for comparison
    const normalizePhone = (phone: string | undefined) => {
        if (!phone) return '';
        const digits = phone.replace(/\D/g, ''); // Remove non-digits
        return digits.slice(-10); // Keep last 10 digits
    };

    const userPhoneNormalized = normalizePhone(currentUser.phone);
    const userEmailLower = currentUser.email?.toLowerCase().trim();

    const userOrders = [...orders]
        .filter(order => {
            // Check Phone Match
            const orderPhoneNormalized = normalizePhone(order.customer.phone);
            const phoneMatch = userPhoneNormalized && orderPhoneNormalized && userPhoneNormalized === orderPhoneNormalized;

            // Check Email Match (fallback if phone doesn't match)
            const orderEmailLower = order.customer.email?.toLowerCase().trim();
            const emailMatch = userEmailLower && orderEmailLower && userEmailLower === orderEmailLower;

            return phoneMatch || emailMatch;
        })
        .reverse(); // Show most recent first

    return (
        <Card className="animate-fade-in max-w-4xl mx-auto">
            <Link to="/profile" className="absolute top-6 left-6 text-purple-300 hover:text-white transition">&larr; {t('back')}</Link>
            <h2 className="text-3xl font-hindi font-bold mb-8 text-center">{t('my_orders')}</h2>

            {/* Premium Status Section - Enhanced Visibility */}
            <div className="mb-8">
                <h3 className="text-xl font-hindi font-bold text-white mb-4 border-b border-white/10 pb-2">सदस्यता स्थिति (Membership Status)</h3>
                
                {isPremiumActive ? (
                    <div className="bg-gradient-to-br from-yellow-900/80 to-amber-800/60 border border-yellow-500 rounded-2xl p-6 text-center relative overflow-hidden shadow-[0_0_25px_rgba(234,179,8,0.3)] animate-fade-in">
                        {/* Shine Effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-150%] animate-[shine_3s_infinite]"></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-3 shadow-lg border-4 border-yellow-300/50">
                                <span className="text-4xl filter drop-shadow-md">👑</span>
                            </div>
                            <h3 className="text-2xl font-hindi font-bold text-yellow-300 mb-1 drop-shadow-md">
                                प्रीमियम सक्रिय है (Premium Active)
                            </h3>
                            <p className="text-white text-lg font-semibold mb-4 bg-black/30 px-4 py-1 rounded-full border border-white/10">
                                {currentUser?.subscriptionPlan || 'Premium Plan'}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/30">
                                    <p className="text-yellow-200 text-xs uppercase tracking-wider">शेष दिन</p>
                                    <p className="text-2xl font-bold text-white">{daysLeft}</p>
                                </div>
                                <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/30">
                                    <p className="text-yellow-200 text-xs uppercase tracking-wider">समाप्ति तिथि</p>
                                    <p className="text-lg font-bold text-white">
                                        {new Date(currentUser?.subscriptionExpiry!).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-white/10 w-full">
                                <p className="text-sm text-yellow-100">
                                    🎉 अब आप स्टोर से सभी <Link to="/store/ebooks" className="underline font-bold text-white hover:text-yellow-200">E-Books</Link> मुफ्त में डाउनलोड कर सकते हैं।
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center border-2 border-gray-600">
                                <span className="text-3xl text-gray-400">🔒</span>
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-white">निःशुल्क सदस्य (Free Member)</h3>
                                <p className="text-purple-300 text-sm mt-1">प्रीमियम सुविधाओं तक पहुँच नहीं है।</p>
                            </div>
                        </div>
                        <Link to="/premium" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform whitespace-nowrap">
                            अभी प्रीमियम अनलॉक करें
                        </Link>
                    </div>
                )}
            </div>

            <h3 className="text-xl font-hindi font-bold text-white mb-4 border-b border-white/10 pb-2">ऑर्डर इतिहास (Order History)</h3>

            {userOrders.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10 border-dashed">
                    <p className="text-purple-200 text-lg mb-4">आपने अभी तक कोई ऑर्डर नहीं दिया है।</p>
                    <Link to="/store" className="text-pink-400 hover:text-pink-300 font-semibold underline">
                        खरीदारी शुरू करें
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {userOrders.map(order => (
                        <Link
                            key={order.id}
                            to={`/orders/${order.id}`}
                            className="block text-left bg-white/5 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 transform transition-all duration-300 hover:bg-purple-500/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/30 group"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-purple-900/50 text-purple-200 text-xs px-2 py-1 rounded border border-purple-500/30 font-mono">
                                            #{order.id.slice(-6).toUpperCase()}
                                        </span>
                                        <p className="text-purple-300 text-sm">
                                            {new Date(order.date).toLocaleDateString('hi-IN', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <p className={`font-bold text-sm px-3 py-1 rounded-full border 
                                        ${order.status === 'Processing' ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' : 
                                          order.status === 'Shipped' ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' : 
                                          order.status === 'Out for Delivery' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' : 
                                          order.status === 'Delivered' ? 'bg-green-500/20 text-green-300 border-green-500/50' : 
                                          order.status === 'Verification Pending' ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' :
                                          'bg-gray-500/20 text-gray-300 border-gray-500/50'}`}>
                                        {order.status === 'Verification Pending' ? 'सत्यापन लंबित' : 
                                         order.status === 'Processing' ? 'प्रक्रिया में' :
                                         order.status === 'Shipped' ? 'भेजा गया' :
                                         order.status === 'Out for Delivery' ? 'डिलीवरी के लिए बाहर' :
                                         order.status === 'Delivered' ? 'डिलीवर किया गया' : order.status}
                                    </p>
                                </div>

                                {/* Items Detail */}
                                <div className="space-y-1">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="text-sm text-white/90">
                                            <span className="font-semibold">• {item.name}</span>
                                            <span className="text-purple-300 ml-2">
                                                (x{item.quantity}
                                                {item.selectedColor ? `, ${item.selectedColor}` : ''}
                                                {item.selectedSize ? `, ${item.selectedSize}` : ''})
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Address Section */}
                                {order.customer.address && (
                                    <div className="text-xs text-purple-200 border-t border-white/10 pt-2 mt-1">
                                        <p><span className="font-bold text-purple-400">शिपिंग पता:</span> {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
                                        <p><span className="font-bold text-purple-400">संपर्क:</span> {order.customer.phone}</p>
                                    </div>
                                )}

                                <div className="text-right border-t border-white/10 pt-2">
                                    <p className="text-xl font-bold text-pink-400">₹{order.total.toFixed(2)}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default OrderHistoryScreen;
