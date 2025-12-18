
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Order, CartItem } from '../types';
import Card from './Card';

interface OrderConfirmationScreenProps {
    orders: Order[];
}

const OrderTracker: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const steps = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    let currentStepIndex = steps.indexOf(status);
    if (status === 'Completed') currentStepIndex = steps.length; // All steps done for digital
    if (status === 'Verification Pending' || status === 'Payment Pending') currentStepIndex = -1; // Not started yet

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="order-tracker">
                <div 
                    className="tracker-progress" 
                    style={{ width: `${currentStepIndex < 0 ? 0 : Math.min(100, (currentStepIndex / (steps.length - 1)) * 80 + 10)}%` }}
                ></div>
                {steps.map((step, index) => (
                    <div key={step} className={`tracker-step ${index <= currentStepIndex ? 'completed' : ''}`}>
                        <div className="tracker-icon">
                           {index <= currentStepIndex ? '✓' : ''}
                        </div>
                        <div className="tracker-label">{step.replace(' ', '\n')}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const OrderConfirmationScreen: React.FC<OrderConfirmationScreenProps> = ({ orders }) => {
    const { orderId } = useParams<{ orderId: string }>();
    const [returnRequestSent, setReturnRequestSent] = useState<string | null>(null);

    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        return (
            <Card className="text-center animate-fade-in">
                <h2 className="text-2xl font-bold text-red-400">कोई ऑर्डर नहीं मिला</h2>
                <p className="text-lg mt-4">ऐसा लगता है कि कोई ऑर्डर नहीं दिया गया है।</p>
                <Link to="/store" className="mt-8 inline-block px-6 py-2 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition">स्टोर पर जाएं</Link>
            </Card>
        );
    }

    const physicalItems = order.items.filter(item => item.productType === 'PHYSICAL');
    const isShipped = order.status === 'Shipped' || order.status === 'Out for Delivery' || order.status === 'Delivered';

    const handleReturnRequest = (itemName: string) => {
        // In a real app, this would verify with backend
        const adminWhatsApp = "919305968628";
        const message = `Return Request for Order #${order.id}\nItem: ${itemName}\nReason: Damaged/Wrong Item (Within 24hrs Policy)`;
        const url = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        setReturnRequestSent(itemName);
    };

    const renderItemAction = (item: CartItem) => {
        // Policy Logic
        if (item.productType === 'DIGITAL') {
            return (
                <span className="text-xs font-bold text-red-400 bg-red-900/30 px-2 py-1 rounded border border-red-500/30">
                    No Refund (Digital)
                </span>
            );
        } else {
            // Physical Product Logic
            const orderDate = new Date(order.date).getTime();
            const now = Date.now();
            const oneDayMs = 24 * 60 * 60 * 1000;
            
            // Check if 24 hours have passed since order (Proxy for delivery time in this demo)
            // Or strictly check if status is 'Delivered'
            const timeElapsed = now - orderDate;
            const isWindowClosed = timeElapsed > oneDayMs; 

            if (isWindowClosed) {
                return (
                    <span className="text-xs font-bold text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-600 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Return Locked (24hr Expired)
                    </span>
                );
            } else if (order.status === 'Delivered') {
                if (returnRequestSent === item.name) {
                     return <span className="text-xs text-yellow-300">Request Sent via WhatsApp</span>;
                }
                return (
                    <button 
                        onClick={() => handleReturnRequest(item.name)}
                        className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition"
                    >
                        Return/Replace (Valid for 24h)
                    </button>
                );
            } else {
                 return <span className="text-xs text-purple-300">Wait for Delivery</span>;
            }
        }
    };

    return (
        <Card className="animate-fade-in text-center">
            <h2 className="text-4xl font-hindi font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                आपके ऑर्डर के लिए धन्यवाद!
            </h2>
            <p className="text-purple-200 mb-2">आपका ऑर्डर सफलतापूर्वक दे दिया गया है।</p>
            <p className="text-sm text-purple-300 mb-8">
                ऑर्डर आईडी: <span className="font-mono">{order.id}</span>
            </p>

             {order.status === 'Verification Pending' && (
                <div className="my-8 bg-yellow-900/50 p-6 rounded-lg border border-yellow-400/50">
                    <h3 className="text-2xl font-hindi font-semibold text-yellow-300 mb-2">भुगतान सत्यापन लंबित है</h3>
                    <p className="text-yellow-200">आपके भुगतान की समीक्षा की जा रही है। अनुमोदन के बाद आपका ऑर्डर संसाधित किया जाएगा।</p>
                </div>
            )}


            {physicalItems.length > 0 && (
                <div className="my-8 bg-white/5 p-6 rounded-lg border border-white/20">
                     <h3 className="text-2xl font-hindi font-semibold text-white mb-4">ऑर्डर ट्रैकिंग</h3>
                     <OrderTracker status={order.status} />
                     {isShipped && order.trackingId && (
                        <div className="mt-8 text-center animate-fade-in">
                            <p className="text-purple-200">
                                आपका ऑर्डर <b className="text-white">{order.carrier}</b> के माध्यम से भेज दिया गया है।
                            </p>
                            <p className="text-purple-200 mt-1">
                                ट्रैकिंग आईडी: <b className="text-white font-mono bg-black/30 px-2 py-1 rounded">{order.trackingId}</b>
                            </p>
                             <a 
                                href={`https://www.google.com/search?q=${order.carrier} tracking ${order.trackingId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-block px-5 py-2 bg-purple-600/80 text-white text-sm font-semibold rounded-full hover:bg-purple-600 transition-colors"
                            >
                                अभी ट्रैक करें
                            </a>
                        </div>
                     )}
                     {!isShipped && (order.status === 'Processing' || order.status === 'Verification Pending') && (
                        <div className="mt-8 text-center">
                            <p className="text-purple-200">आपका ऑर्डर पैक किया जा रहा है। शिपमेंट विवरण जल्द ही यहां दिखाई देंगे।</p>
                        </div>
                     )}
                </div>
            )}
             {physicalItems.length === 0 && (order.status === 'Completed' || (order.status === 'Processing' && order.paymentStatus === 'COMPLETED')) && (
                <div className="my-8 bg-green-900/50 p-6 rounded-lg border border-green-400/50">
                    <h3 className="text-2xl font-hindi font-semibold text-green-300 mb-2">डिलीवरी पूर्ण</h3>
                    <p className="text-green-200">आपकी डिजिटल ई-पुस्तकें भुगतान सत्यापन के तुरंत बाद आपके पंजीकृत व्हाट्सएप नंबर पर भेज दी जाएंगी।</p>
                </div>
             )}


            <div className="bg-white/5 p-6 rounded-lg border border-white/20 mt-8 max-w-lg mx-auto text-left">
                <h3 className="text-xl font-hindi font-semibold text-white mb-4">ऑर्डर विवरण</h3>
                
                {order.customer.address && (
                    <div className="mb-4 pb-4 border-b border-white/10">
                        <p className="text-purple-300 text-xs uppercase font-bold mb-1">शिपिंग पता</p>
                        <p className="text-white">{order.customer.name}</p>
                        <p className="text-white/80 text-sm">{order.customer.address}</p>
                        <p className="text-white/80 text-sm">{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
                        <p className="text-white/80 text-sm">Phone: {order.customer.phone}</p>
                    </div>
                )}

                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-4">
                    {order.items.map((item: CartItem) => (
                        <div key={`${item.id}-${item.selectedColor}`} className="flex flex-col bg-white/5 p-3 rounded-lg">
                            <div className="flex justify-between items-center text-sm mb-2">
                                <div className="text-white/90 truncate pr-2">
                                    <span className="font-semibold">{item.name}</span>
                                    <span className="text-xs text-purple-300 ml-2">x {item.quantity}</span>
                                    <div className="text-xs text-purple-300">
                                        {item.selectedColor && <span>Color: {item.selectedColor} </span>}
                                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                                    </div>
                                </div>
                                <span className="text-white font-semibold">₹{((item.mrp - (item.mrp * item.discountPercentage / 100)) * item.quantity).toFixed(2)}</span>
                            </div>
                            
                            {/* Action / Status Bar for Refund Policy */}
                            <div className="border-t border-white/10 pt-2 flex justify-end">
                                {renderItemAction(item)}
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="border-t border-white/20 pt-4 space-y-1">
                    <div className="flex justify-between text-lg font-bold">
                        <span className="text-white">कुल:</span>
                        <span className="text-white">₹{order.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <Link to="/" className="mt-8 inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out text-lg">
                मुख्य पृष्ठ पर वापस जाएं
            </Link>
        </Card>
    );
};

export default OrderConfirmationScreen;
