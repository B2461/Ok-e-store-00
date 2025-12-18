
import React, { useState, useCallback, useEffect, useRef, createContext, useContext, useMemo } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { DivinationType, CartItem, Order, CustomerDetails, Product, Notification, VerificationRequest, SupportTicket, SocialMediaPost, SubscriptionPlan, UserProfile } from './types';
import { products as initialProducts } from './data/products';
import { ebooks } from './data/ebooks';
import { toolCategories, showcaseTools } from './data/tools';
import { subscribeToAuthChanges, loginUser, registerUser, logoutUser } from './services/firebaseService';

// Components
import WelcomeScreen from './components/WelcomeScreen';
import SelectionScreen from './components/SelectionScreen';
import SettingsScreen from './components/SettingsScreen';
import PujanSamagriStore from './components/PujanSamagriStore';
import ProductDetailScreen from './components/ProductDetailScreen';
import ShoppingCartScreen from './components/ShoppingCartScreen';
import CheckoutScreen from './components/CheckoutScreen';
import OrderConfirmationScreen from './components/OrderConfirmationScreen';
import NotificationBell from './components/NotificationBell';
import AdminScreen from './components/AdminScreen';
import TermsAndConditions from './components/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import ProfileScreen from './components/ProfileScreen';
import BottomNavBar from './components/BottomNavBar';
import LoginScreen from './components/LoginScreen';
import OrderHistoryScreen from './components/OrderHistoryScreen';
import SupportTicketScreen from './components/SupportTicketScreen';
import SearchModal from './components/SearchModal';
import PremiumScreen from './components/PremiumScreen';
import SubscriptionPaymentScreen from './components/SubscriptionPaymentScreen';
import SubscriptionConfirmationScreen from './components/SubscriptionConfirmationScreen';
import WishlistScreen from './components/WishlistScreen';
import DivinationScreen from './components/DivinationScreen';

// --- I18n Language & Auth System ---
const translations = {
  hi: {
    terms_and_conditions: 'नियम और शर्तें',
    privacy_policy: 'गोपनीयता नीति',
    copyright: `© ${new Date().getFullYear()} Ok-E-store. सर्वाधिकार सुरक्षित।`,
    settings: 'सेटिंग्स',
    back: 'वापस',
    my_orders: 'मेरे ऑर्डर',
    welcome_notification_title: 'आपका स्वागत है!',
    welcome_notification_message: 'Ok-E-store में आपका स्वागत है। खरीदारी शुरू करें!',
    special_offer_title: 'विशेष पेशकश!',
    special_offer_message: 'हमारी नई पूजन सामग्री स्टोर देखें।',
    music: 'संगीत',
    admin: 'एडमिन',
    notifications: 'Alert',
    profile: 'प्रोफ़ाइल',
    cart: 'कार्ट',
    search: 'खोज',
    login: 'लॉगिन',
    wishlist: 'पसंद',
    welcome_greeting: 'Ok-E-store में आपका स्वागत है',
    welcome_subtitle: 'आध्यात्मिक और आधुनिक जीवनशैली की खरीदारी करें',
    welcome_intro: 'यह ऐप पूजन सामग्री, ई-पुस्तकें, मोबाइल एक्सेसरीज़ और बहुत कुछ खरीदने के लिए आपकी वन-स्टॉप-शॉप है।',
    start_journey: 'खरीदारी शुरू करें',
    agree_to_terms_privacy_part1: 'मैं',
    agree_to_terms_privacy_part2: 'और',
    agree_to_terms_privacy_part3: 'से सहमत हूँ।',
    select_language: 'भाषा चुनें',
    select_theme: 'थीम चुनें',
    spiritual_store: 'आध्यात्मिक स्टोर',
    shopping: 'शॉपिंग',
    admin_tools: 'एडमिन उपकरण',
    support_and_help: 'सहायता और समर्थन',
    raise_ticket: 'टिकट बनाएं',
    ticket_category: 'समस्या की श्रेणी',
    describe_issue: 'अपनी समस्या का विस्तार से वर्णन करें',
    submit_ticket: 'टिकट जमा करें',
    ticket_submitted_success_title: 'टिकट सफलतापूर्वक जमा किया गया!',
    ticket_submitted_success_message: 'हमारी टीम जल्द ही आपसे दिए गए मोबाइल नंबर पर संपर्क करेगी।',
    support_ticket_manager: 'सहायता टिकट प्रबंधक',
    ticket_status_open: 'खुला',
    ticket_status_closed: 'बंद',
    mark_as_resolved: 'हल के रूप में चिह्नित करें',
    reopen_ticket: 'टिकट फिर से खोलें',
    social_media_manager: 'सोशल मीडिया मैनेजर',
    create_new_post: 'नई पोस्ट बनाएं',
    post_content: 'पोस्ट कंटेंट',
    post_image: 'पोस्ट इमेज (वैकल्पप्िक)',
    platforms: 'प्लेटफार्म',
    generate_post: 'पोस्ट बनाएं',
    update_post: 'पोस्ट अपडेट करें',
    recent_posts: 'हाल की पोस्ट्स',
    premium_unlock_title: 'प्रीमियम अनलॉक करें',
    premium_unlock_subtitle: 'सभी तंत्र मंत्र यंत्र ई-बुक्स तक असीमित पहुंच प्राप्त करें।',
    premium_trial_banner_title: 'ई-बुक्स का खजाना!',
    premium_trial_banner_desc: 'अभी सब्सक्राइब करें और सभी PDF सीधे डाउनलोड करें।',
    premium_monthly_plan: 'मासिक प्लान',
    premium_yearly_plan: 'वार्षिक प्लान',
    premium_choose_plan: 'प्लान चुनें',
    payment_title: 'भुगतान',
    payment_your_name: 'आपका नाम',
    payment_your_phone: 'आपका फोन नंबर',
    payment_enter_txn_id: '12-अंकीय लेनदेन आईडी दर्ज करें',
    payment_paid_button: 'भुगतान हो गया',
    payment_verifying_title: 'सत्यापन जारी है',
    payment_verifying_subtitle: 'हम आपके भुगतान की पुष्टि कर रहे हैं।',
    payment_after_instruction: 'भुगतान के बाद, ट्रांजेक्शन आईडी दर्ज करें और स्क्रीनशॉट अपलोड करें।',
    payment_invalid_txn_id: 'अमान्य ट्रांजेक्शन आईडी।',
    sub_confirm_title: 'सदस्यता अनुरोध प्राप्त हुआ!',
    sub_confirm_message: 'आपका अनुरोध प्रक्रियाधीन है। भुगतान सत्यापित होने के बाद प्रीमियम सुविधाएं सक्रिय हो जाएंगी।',
    sub_confirm_button: 'होम पर जाएं',
  },
  en: {
    terms_and_conditions: 'Terms & Conditions',
    privacy_policy: 'Privacy Policy',
    copyright: `© ${new Date().getFullYear()} Ok-E-store. All rights reserved.`,
    settings: 'Settings',
    back: 'Back',
    my_orders: 'My Orders',
    welcome_notification_title: 'Welcome!',
    welcome_notification_message: 'Welcome to Ok-E-store. Start shopping!',
    special_offer_title: 'Special Offer!',
    special_offer_message: 'Check out our new spiritual items store.',
    music: 'Music',
    admin: 'Admin',
    notifications: 'Alert',
    profile: 'Profile',
    cart: 'Cart',
    search: 'Search',
    login: 'Login',
    wishlist: 'Wishlist',
    welcome_greeting: 'Welcome to Ok-E-store',
    welcome_subtitle: 'Shop for spiritual and modern lifestyle products',
    welcome_intro: 'This app is your one-stop-shop for spiritual items, e-books, mobile accessories, and more.',
    start_journey: 'Start Shopping',
    agree_to_terms_privacy_part1: 'I agree to the',
    agree_to_terms_privacy_part2: 'and',
    agree_to_terms_privacy_part3: '.',
    select_language: 'Select Language',
    select_theme: 'Select Theme',
    spiritual_store: 'Spiritual Store',
    shopping: 'Shopping',
    admin_tools: 'Admin Tools',
    support_and_help: 'Support & Help',
    raise_ticket: 'Raise a Ticket',
    ticket_category: 'Issue Category',
    describe_issue: 'Describe your issue in detail',
    submit_ticket: 'Submit Ticket',
    ticket_submitted_success_title: 'Ticket Submitted Successfully!',
    ticket_submitted_success_message: 'Our team will contact you shortly on the mobile number provided.',
    support_ticket_manager: 'Support Ticket Manager',
    ticket_status_open: 'Open',
    ticket_status_closed: 'Closed',
    mark_as_resolved: 'Mark as Resolved',
    reopen_ticket: 'Re-open Ticket',
    social_media_manager: 'Social Media Manager',
    create_new_post: 'Create New Post',
    post_content: 'Post Content',
    post_image: 'Post Image (optional)',
    platforms: 'Platforms',
    generate_post: 'Generate Post',
    update_post: 'Update Post',
    recent_posts: 'Recent Posts',
    premium_unlock_title: 'Unlock Premium',
    premium_unlock_subtitle: 'Get unlimited access to all Astrology and AI tools.',
    premium_trial_banner_title: 'Free Trial Available!',
    premium_trial_banner_desc: 'Sign up today and get 3 days free.',
    premium_monthly_plan: 'Monthly Plan',
    premium_yearly_plan: 'Yearly Plan',
    premium_choose_plan: 'Choose Plan',
    payment_title: 'Payment',
    payment_your_name: 'Your Name',
    payment_your_phone: 'Your Phone Number',
    payment_enter_txn_id: 'Enter 12-digit Transaction ID',
    payment_paid_button: 'I Have Paid',
    payment_verifying_title: 'Verifying Payment',
    payment_verifying_subtitle: 'We are verifying your payment details.',
    payment_after_instruction: 'After payment, enter Transaction ID and upload screenshot.',
    payment_invalid_txn_id: 'Invalid Transaction ID.',
    sub_confirm_title: 'Subscription Request Received!',
    sub_confirm_message: 'Your request is processing. Premium features will be activated once payment is verified.',
    sub_confirm_button: 'Go to Home',
  },
};

export const divinationTypeTranslations: Record<string, string> = {
    'पूजन सामग्री': 'Worship Items',
    'तंत्र मंत्र यन्त्र PDF E-book': 'Tantra Mantra Yantra PDF E-book',
    'रत्न आभूषण': 'Gems & Jewelry',
    'मोबाइल एक्सेसरीज': 'Mobile Accessories',
    'लेडीज जेंट्स एंड बेबी शूज': 'Ladies, Gents & Baby Shoes',
    'लेडीज एंड जेंट्स पर्स बैग बेल्ट चाबी का गुच्छा': 'Ladies & Gents Accessories',
    'एडमिन पैनल': 'Admin Panel',
    'आध्यात्मिक स्टोर': 'Spiritual Store',
    'शॉपिंग': 'Shopping',
    'स्थानीय विपणन': 'Local Marketing',
};

// Icons
const CartIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const OrderIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${isActive ? 'text-black' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
);

const SearchIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const HeartIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${isActive ? 'text-pink-500 fill-pink-500' : 'text-current'}`} fill={isActive ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

interface AppContextType {
    language: 'hi' | 'en';
    setLanguage: (lang: 'hi' | 'en') => void;
    theme: string;
    setTheme: (theme: string) => void;
    t: (key: string, options?: Record<string, string | number>) => string;
    tDiv: (type: DivinationType) => { en: string; hi: string };
    isAuthenticated: boolean;
    currentUser: UserProfile | null;
    showAuth: (onSuccess?: () => void) => void;
    handleLogin: (email: string, password: string) => Promise<string | null>;
    handleSignup: (profileData: UserProfile) => Promise<boolean>;
    logout: () => void;
    deleteCurrentUser: () => void;
    updateProfile: (profile: UserProfile) => void;
    wishlist: string[];
    toggleWishlist: (productId: string) => void;
    isPremiumActive: boolean;
    setExtendedProfiles: React.Dispatch<React.SetStateAction<Record<string, UserProfile>>>;
    setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
    // Expose these for AppComp to use
    orders: Order[];
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
    supportTickets: SupportTicket[];
    setSupportTickets: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<'hi' | 'en'>(() => (localStorage.getItem('okFutureZoneLanguage') as 'hi' | 'en') || 'en');
    const [theme, setTheme] = useState(() => localStorage.getItem('okFutureZoneTheme') || 'cosmic');
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [extendedProfiles, setExtendedProfiles] = useState<Record<string, UserProfile>>(() => {
        try { const saved = localStorage.getItem('okFutureZoneExtendedProfiles'); return saved ? JSON.parse(saved) : {}; } catch { return {}; }
    });
    
    // Lifted state from AppComp to Provider to avoid conflicts and share state
    const [orders, setOrders] = useState<Order[]>(() => {
        try { const saved = localStorage.getItem('okFutureZoneOrders'); return saved ? JSON.parse(saved) : []; } catch { return []; }
    });
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
        try { const saved = localStorage.getItem('okFutureZoneSupportTickets'); return saved ? JSON.parse(saved) : []; } catch { return []; }
    });
    const [wishlist, setWishlist] = useState<string[]>(() => {
        try { const saved = localStorage.getItem('okFutureZoneWishlist'); return saved ? JSON.parse(saved) : []; } catch { return []; }
    });

    const [isAuthVisible, setIsAuthVisible] = useState(false);
    const [authSuccessCallback, setAuthSuccessCallback] = useState<(() => void) | null>(null);

    const isPremiumActive = useMemo(() => {
        if (!currentUser?.subscriptionExpiry) return false;
        return new Date(currentUser.subscriptionExpiry) > new Date();
    }, [currentUser]);

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
            if (firebaseUser) {
                const email = firebaseUser.email || '';
                const extendedData = extendedProfiles[email] || {};
                
                const profile: UserProfile = {
                    name: firebaseUser.displayName || extendedData.name || '',
                    email: email,
                    profilePicture: extendedData.profilePicture,
                    phone: extendedData.phone || '',
                    dob: extendedData.dob,
                    timeOfBirth: extendedData.timeOfBirth,
                    placeOfBirth: extendedData.placeOfBirth,
                    signupDate: extendedData.signupDate || new Date().toISOString(),
                    subscriptionPlan: extendedData.subscriptionPlan,
                    subscriptionExpiry: extendedData.subscriptionExpiry,
                    isPremium: extendedData.isPremium,
                    downloadsConsumed: extendedData.downloadsConsumed || 0
                };
                setCurrentUser(profile);
                setIsAuthenticated(true);
                if (!extendedProfiles[email]) {
                     setExtendedProfiles(prev => ({ ...prev, [email]: profile }));
                }
            } else {
                setCurrentUser(null);
                setIsAuthenticated(false);
            }
        });
        return () => unsubscribe();
    }, [extendedProfiles]);

    useEffect(() => { localStorage.setItem('okFutureZoneLanguage', language); document.documentElement.lang = language; }, [language]);
    useEffect(() => { localStorage.setItem('okFutureZoneTheme', theme); document.body.setAttribute('data-theme', theme); }, [theme]);
    useEffect(() => { localStorage.setItem('okFutureZoneExtendedProfiles', JSON.stringify(extendedProfiles)); }, [extendedProfiles]);
    useEffect(() => { localStorage.setItem('okFutureZoneOrders', JSON.stringify(orders)); }, [orders]);
    useEffect(() => { localStorage.setItem('okFutureZoneSupportTickets', JSON.stringify(supportTickets)); }, [supportTickets]);
    useEffect(() => { localStorage.setItem('okFutureZoneWishlist', JSON.stringify(wishlist)); }, [wishlist]);

    const t = useCallback((key: string, options?: Record<string, string | number>): string => {
        let translation = translations[language][key as keyof typeof translations.hi] || key;
        if (options) { Object.keys(options).forEach(optionKey => { translation = translation.replace(`{${optionKey}}`, String(options[optionKey])); }); }
        return translation;
    }, [language]);

    const tDiv = useCallback((type: DivinationType): { en: string; hi: string } => {
        const englishName = divinationTypeTranslations[type] || type;
        return { en: englishName, hi: type };
    }, []);

    const showAuth = (onSuccess?: () => void) => {
        setIsAuthVisible(true);
        if (onSuccess) { setAuthSuccessCallback(() => onSuccess); }
    };

    const handleLoginLogic = async (email: string, password: string): Promise<string | null> => {
        try {
            await loginUser(email, password);
            setIsAuthVisible(false);
            if (authSuccessCallback) { authSuccessCallback(); setAuthSuccessCallback(null); }
            return null;
        } catch (error: any) {
            console.error("Login failed", error);
            if (email === 'demo@example.com' && password === 'password') {
                const demoUser: UserProfile = {
                    name: 'Demo User',
                    email: 'demo@example.com',
                    phone: '9876543210',
                    signupDate: new Date().toISOString(),
                    isPremium: true,
                    subscriptionPlan: 'Yearly',
                    subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                    downloadsConsumed: 0
                };
                setCurrentUser(demoUser);
                setIsAuthenticated(true);
                setIsAuthVisible(false);
                if (authSuccessCallback) { authSuccessCallback(); setAuthSuccessCallback(null); }
                return null;
            }
            if (error.code === 'auth/invalid-credential' || error.message.includes('invalid-credential')) {
                return 'ईमेल या पासवर्ड गलत है।';
            }
            if (error.code === 'auth/user-not-found') {
                return 'खाता नहीं मिला। कृपया साइन अप करें।';
            }
            if (error.code === 'auth/wrong-password') {
                return 'गलत पासवर्ड।';
            }
            return 'लॉगिन विफल। कृपया पुनः प्रयास करें।';
        }
    };
    
    const handleSignupLogic = async (profileData: UserProfile): Promise<boolean> => {
        if (!profileData.email || !profileData.password) return false;
        try {
            await registerUser(profileData.email, profileData.password, profileData.name || '');
            const extendedData = { ...profileData, signupDate: new Date().toISOString(), downloadsConsumed: 0 };
            delete extendedData.password;
            setExtendedProfiles(prev => ({ ...prev, [profileData.email!]: extendedData }));
            setIsAuthVisible(false);
            if (authSuccessCallback) { authSuccessCallback(); setAuthSuccessCallback(null); }
            return true;
        } catch (error) {
             console.error("Signup failed", error);
             return false;
        }
    };

    const logout = async () => {
        await logoutUser();
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    const updateProfile = (updatedProfile: UserProfile) => {
        if (currentUser?.email) {
            const newProfile = { ...currentUser, ...updatedProfile };
            setCurrentUser(newProfile);
            setExtendedProfiles(prev => ({...prev, [currentUser.email!]: newProfile }));
        }
    };

    const deleteCurrentUser = async () => {
        if (currentUser?.email) {
            const emailToDelete = currentUser.email;
            const phoneToDelete = currentUser.phone;
            setExtendedProfiles(prev => { const newProfiles = { ...prev }; delete newProfiles[emailToDelete]; return newProfiles; });
            if (phoneToDelete) {
                setOrders(prev => prev.filter(o => o.customer.phone !== phoneToDelete));
                setSupportTickets(prev => prev.filter(t => t.userPhone !== phoneToDelete));
            }
            await logout();
        }
    };

    const toggleWishlist = (productId: string) => {
        setWishlist(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };
    
    const value = useMemo(() => ({
        language, setLanguage, theme, setTheme, t, tDiv, isAuthenticated, currentUser, showAuth, logout, deleteCurrentUser, updateProfile, 
        handleLogin: handleLoginLogic, handleSignup: handleSignupLogic,
        wishlist, toggleWishlist, isPremiumActive, setExtendedProfiles, setCurrentUser,
        orders, setOrders, supportTickets, setSupportTickets
    }), [language, theme, isAuthenticated, currentUser, t, tDiv, wishlist, isPremiumActive, orders, supportTickets]);

    return (
        <AppContext.Provider value={value}>
            {children}
            {isAuthVisible && <LoginScreen onClose={() => setIsAuthVisible(false)} onLogin={handleLoginLogic} onSignup={handleSignupLogic} />}
        </AppContext.Provider>
    );
};

const AppComp: React.FC = () => {
    const appContext = useAppContext();
    const { currentUser, t, updateProfile, isAuthenticated, showAuth, wishlist, setCurrentUser, orders, setOrders, supportTickets, setSupportTickets, setExtendedProfiles } = appContext;
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const [products, setProducts] = useState<Product[]>([...initialProducts, ...ebooks]);
    const [cartItems, setCartItems] = useState<CartItem[]>(() => { try { const saved = localStorage.getItem('okFutureZoneCartItems'); return saved ? JSON.parse(saved) : []; } catch { return []; } });
    const [notifications, setNotifications] = useState<Notification[]>(() => { try { const saved = localStorage.getItem('okFutureZoneNotifications'); return saved ? JSON.parse(saved) : []; } catch { return []; } });
    const [pendingVerifications, setPendingVerifications] = useState<VerificationRequest[]>(() => { try { const saved = localStorage.getItem('okFutureZonePendingVerifications'); return saved ? JSON.parse(saved) : []; } catch { return []; } });
    const [socialMediaPosts, setSocialMediaPosts] = useState<SocialMediaPost[]>(() => { try { const saved = localStorage.getItem('okFutureZoneSocialMediaPosts'); return saved ? JSON.parse(saved) : []; } catch { return []; } });
    const [categoryVisibility, setCategoryVisibility] = useState<Record<string, boolean>>(() => {
        try { const saved = localStorage.getItem('okFutureZoneCategoryVisibility'); if (saved) { return JSON.parse(saved); } } catch {}
        const defaultVisibility: Record<string, boolean> = {};
        toolCategories.forEach(cat => { defaultVisibility[cat.name] = true; });
        return defaultVisibility;
    });
    
    // Social Media Visibility State with safeguard
    const [socialVisibility, setSocialVisibility] = useState<Record<string, boolean>>(() => {
        try { 
            const saved = localStorage.getItem('okFutureZoneSocialVisibility_v2'); 
            if (saved) { 
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === 'object') return parsed;
            } 
        } catch {}
        return {
            facebook: true,
            instagram: true,
            whatsapp: true,
            telegram: true,
            youtube: true,
            atoplay: true,
            arratai: true,
            share: true
        };
    });

    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState<(SubscriptionPlan & { autoRenew: boolean }) | null>(null);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    // Green Flash Logic States
    const [flashCart, setFlashCart] = useState(false);
    const [flashOrder, setFlashOrder] = useState(false);
    const [flashNotif, setFlashNotif] = useState(false);
    const [activeSocial, setActiveSocial] = useState<string | null>(null);

    // Track previous lengths to detect additions
    const prevCartLength = useRef(cartItems.length);
    const prevOrderLength = useRef(orders.length);
    const prevNotifLength = useRef(notifications.length);

    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            const flash = document.createElement('div');
            flash.className = 'click-flash-effect';
            flash.style.left = `${e.clientX}px`;
            flash.style.top = `${e.clientY}px`;
            document.body.appendChild(flash);
            setTimeout(() => {
                if (document.body.contains(flash)) {
                    document.body.removeChild(flash);
                }
            }, 500); 
        };

        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, []);

    useEffect(() => { localStorage.setItem('okFutureZoneCartItems', JSON.stringify(cartItems)); }, [cartItems]);
    useEffect(() => { localStorage.setItem('okFutureZoneNotifications', JSON.stringify(notifications)); }, [notifications]);
    useEffect(() => { localStorage.setItem('okFutureZonePendingVerifications', JSON.stringify(pendingVerifications)); }, [pendingVerifications]);
    useEffect(() => { localStorage.setItem('okFutureZoneSocialMediaPosts', JSON.stringify(socialMediaPosts)); }, [socialMediaPosts]);
    useEffect(() => { localStorage.setItem('okFutureZoneCategoryVisibility', JSON.stringify(categoryVisibility)); }, [categoryVisibility]);
    useEffect(() => { localStorage.setItem('okFutureZoneSocialVisibility_v2', JSON.stringify(socialVisibility)); }, [socialVisibility]);

    useEffect(() => { if (cartItems.length > prevCartLength.current) setFlashCart(true); prevCartLength.current = cartItems.length; }, [cartItems]);
    useEffect(() => { if (orders.length > prevOrderLength.current) setFlashOrder(true); prevOrderLength.current = orders.length; }, [orders]);
    useEffect(() => { if (notifications.length > prevNotifLength.current) setFlashNotif(true); prevNotifLength.current = notifications.length; }, [notifications]);

    useEffect(() => {
        const cleanupOldOrders = () => {
            const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;
            const now = Date.now();
            setOrders(prevOrders => {
                const recentOrders = prevOrders.filter(order => {
                    const orderDate = new Date(order.date).getTime();
                    return (now - orderDate) < FIFTEEN_DAYS_MS;
                });
                return recentOrders;
            });
        };
        cleanupOldOrders();
    }, []);

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('okFutureZoneWelcomeNotif');
        if (!hasSeenWelcome) {
            setNotifications(prev => [
                { id: `notif-${Date.now()}-1`, icon: '👋', title: 'welcome_notification_title', message: 'welcome_notification_message', timestamp: new Date().toISOString(), read: false },
                { id: `notif-${Date.now()}-2`, icon: '🛍️', title: 'special_offer_title', message: 'special_offer_message', timestamp: new Date().toISOString(), read: false }, ...prev
            ]);
            localStorage.setItem('okFutureZoneWelcomeNotif', 'true');
        }
    }, []);
    
    useEffect(() => {
        const SHOWCASE_NOTIF_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours
        
        const checkAndSendShowcaseNotif = () => {
            const lastTimeStr = localStorage.getItem('okFutureZoneLastShowcaseNotif');
            const lastTime = lastTimeStr ? parseInt(lastTimeStr, 10) : 0;
            const now = Date.now();

            if (now - lastTime > SHOWCASE_NOTIF_INTERVAL) {
                if (showcaseTools.length > 0) {
                    const randomTool = showcaseTools[Math.floor(Math.random() * showcaseTools.length)];
                    
                    const newNotification: Notification = {
                        id: `showcase-notif-${now}`,
                        icon: randomTool.icon,
                        title: randomTool.motivationalTextHi || 'सुझाव',
                        message: randomTool.descriptionHi || randomTool.description,
                        timestamp: new Date().toISOString(),
                        read: false
                    };
                    
                    setNotifications(prev => [newNotification, ...prev]);
                    localStorage.setItem('okFutureZoneLastShowcaseNotif', now.toString());
                }
            }
        };

        checkAndSendShowcaseNotif();
        const intervalId = setInterval(checkAndSendShowcaseNotif, 60000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const NOTIFICATION_INTERVAL = 8 * 60 * 60 * 1000; 
        const CHECK_INTERVAL = 5 * 60 * 1000;

        const notificationTemplates = [
            { icon: '👟', title: 'स्टाइल अलर्ट!', message: 'जूतों के नए कलेक्शन पर भारी छूट। अभी खरीदारी करें!' },
            { icon: '📚', title: 'ज्ञान बढ़ाएं', message: 'नई ई-बुक्स अब उपलब्ध हैं। सफलता की ओर एक कदम बढ़ाएं।' },
            { icon: '🕉️', title: 'आध्यात्मिक शांति', message: 'शुद्ध पूजन सामग्री और यंत्र घर मंगवाएं।' },
            { icon: '🎧', title: 'गैजेट अपडेट', message: 'बेहतरीन मोबाइल एक्सेसरीज सबसे कम दाम में।' },
            { icon: '💎', title: 'चमकदार ऑफर', message: 'रत्न और आभूषणों पर विशेष छूट। अभी देखें!' },
        ];

        const sendProductNotification = () => {
            const lastNotificationTime = parseInt(localStorage.getItem('okFutureZoneLastProductNotification') || '0', 10);
            const now = Date.now();
            
            if (now - lastNotificationTime > NOTIFICATION_INTERVAL) {
                const randomTemplate = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
                const newNotification: Notification = { 
                    id: `auto-notif-${now}`, 
                    icon: randomTemplate.icon, 
                    title: randomTemplate.title, 
                    message: randomTemplate.message, 
                    timestamp: new Date().toISOString(), 
                    read: false 
                };
                setNotifications(prev => [newNotification, ...prev]);
                localStorage.setItem('okFutureZoneLastProductNotification', now.toString());
            }
        };
        sendProductNotification();
        const intervalId = setInterval(sendProductNotification, CHECK_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);

    const handleProtectedLink = (path: string) => {
        if (isAuthenticated) { navigate(path); } else { showAuth(() => navigate(path)); }
    };

    const handleSelectDivinationType = (type: DivinationType) => {
        switch (type) {
            case DivinationType.PUJAN_SAMAGRI: navigate('/store/pujan-samagri'); break;
            case DivinationType.TANTRA_MANTRA_YANTRA_EBOOK: navigate('/store/ebooks'); break;
            case DivinationType.GEMS_JEWELRY: navigate('/store/gems-jewelry'); break;
            case DivinationType.MOBILE_ACCESSORIES: navigate('/store/mobile-accessories'); break;
            case DivinationType.LADIES_GENTS_BABY_SHOES: navigate('/store/shoes'); break;
            case DivinationType.LADIES_GENTS_ACCESSORIES: navigate('/store/accessories'); break;
            case DivinationType.DIVINATION_STORE: navigate('/store'); break;
            default: break;
        }
    };
    
    const addToCart = (product: Product, quantity: number, color: string, size?: string) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === product.id && item.selectedColor === color && item.selectedSize === size);
            if (existingItem) { return prev.map(item => item.id === product.id && item.selectedColor === color && item.selectedSize === size ? { ...item, quantity: item.quantity + quantity } : item); }
            return [...prev, { ...product, quantity, selectedColor: color, selectedSize: size }];
        });
    };
    
    const onUpdateCartQuantity = (productId: string, color: string, newQuantity: number, size?: string) => { 
        setCartItems(prev => prev.map(item => item.id === productId && item.selectedColor === color && item.selectedSize === size ? { ...item, quantity: newQuantity > 0 ? newQuantity : 1 } : item)); 
    };
    const onRemoveCartItem = (productId: string, color: string, size?: string) => { 
        setCartItems(prev => prev.filter(item => !(item.id === productId && item.selectedColor === color && item.selectedSize === size))); 
    };
    
    const onPlaceOrder = (customerDetails: CustomerDetails, total: number, paymentMethod: 'PREPAID' | 'COD', orderId: string) => {
        const newOrder: Order = { id: orderId, items: cartItems, customer: customerDetails, total, date: new Date().toISOString(), status: paymentMethod === 'PREPAID' ? 'Verification Pending' : 'Processing', paymentMethod, paymentStatus: paymentMethod === 'PREPAID' ? 'VERIFICATION_PENDING' : 'PENDING' };
        setOrders(prev => [...prev, newOrder]);
        setCartItems([]);
    };
    
    const onVerificationRequest = (request: Omit<VerificationRequest, 'id' | 'requestDate'>) => {
        const newRequest: VerificationRequest = { ...request, id: `vr-${Date.now()}`, requestDate: new Date().toISOString() };
        setPendingVerifications(prev => [...prev, newRequest]);
    };
    
    const onApproveVerification = (requestId: string) => {
        const request = pendingVerifications.find(r => r.id === requestId);
        if (!request) return;

        if (request.type === 'PRODUCT' && request.orderId) { 
            setOrders(prevOrders => prevOrders.map(o => o.id === request.orderId ? { ...o, status: 'Processing', paymentStatus: 'COMPLETED' } : o)); 
        } 
        else if (request.type === 'SUBSCRIPTION') {
            const now = new Date();
            let daysToAdd = 30; // Default Monthly
            if (request.planName.toLowerCase().includes('weekly')) daysToAdd = 7;
            if (request.planName.toLowerCase().includes('yearly')) daysToAdd = 365;
            
            const expiryDate = new Date(now.setDate(now.getDate() + daysToAdd)).toISOString();
            const targetEmail = request.userEmail;

            if (targetEmail) {
                setExtendedProfiles((prev: Record<string, any>) => {
                    const existingProfile = prev[targetEmail] || {};
                    return {
                        ...prev,
                        [targetEmail]: {
                            ...existingProfile,
                            isPremium: true,
                            subscriptionPlan: request.planName,
                            subscriptionExpiry: expiryDate,
                            downloadsConsumed: 0,
                            email: targetEmail
                        }
                    };
                });

                if (currentUser && currentUser.email === targetEmail) {
                    setCurrentUser(prev => ({
                        ...prev!,
                        isPremium: true,
                        subscriptionPlan: request.planName,
                        subscriptionExpiry: expiryDate,
                        downloadsConsumed: 0
                    }));
                }
            } else {
                console.warn("Could not activate premium: User Email is missing in verification request.");
            }
        }

        setPendingVerifications(prev => prev.filter(r => r.id !== requestId));
    };

    const handleSelectPlan = (plan: SubscriptionPlan & { autoRenew: boolean }) => {
        setSelectedSubscriptionPlan(plan);
        navigate('/subscribe');
    };

    const handleShare = async () => {
        const shareUrl = 'https://www.appcreator24.com/app3840105-ksz07y';
        const shareText = 'नमस्ते! Ok-E-store से बेहतरीन उत्पाद और ई-बुक्स खरीदें। अभी ऐप देखें:';
        
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Ok-E-store',
                    text: shareText,
                    url: shareUrl,
                });
            } else {
                throw new Error('Web Share API not supported');
            }
        } catch (error: any) {
            // If user cancelled, do nothing
            if (error.name === 'AbortError' || error.message?.toLowerCase().includes('cancel')) return;
            
            try {
                // Clipboard Fallback
                const fullText = `${shareText} ${shareUrl}`;
                await navigator.clipboard.writeText(fullText);
                alert('लिंक कॉपी हो गया है! आप इसे व्हाट्सएप या अन्य ऐप पर शेयर कर सकते हैं।');
            } catch (clipboardError) {
                prompt('इस लिंक को कॉपी करें:', shareUrl);
            }
        }
    };

    const handleSocialClick = (e: React.MouseEvent, platform: string) => {
        // e.preventDefault(); // Removed to allow navigation for anchors
        setActiveSocial(platform);
        setTimeout(() => setActiveSocial(null), 2000);
    };

    const activeIconClass = "bg-yellow-400 text-black rounded-lg shadow-[0_0_15px_rgba(250,204,21,0.6)] transform scale-105 transition-all duration-300";
    const inactiveIconClass = "hover:bg-white/10 text-white transition-colors duration-300";

    // New Styles for Social Icons - Matching Header Icon Style
    // Square-ish shape with rounded corners, centered icon, yellow bg on active
    const activeSocialClass = "bg-yellow-400 text-black rounded-lg shadow-[0_0_15px_rgba(250,204,21,0.6)] transform scale-110 flex items-center justify-center w-10 h-10 transition-all duration-300";
    const inactiveSocialClass = "text-white hover:bg-white/10 rounded-lg transform hover:scale-125 flex items-center justify-center w-10 h-10 transition-all duration-300 animate-flash-saffron-slow";

    // Helper to check if a social icon is visible
    const isSocialVisible = (key: string) => (socialVisibility && socialVisibility[key]) ?? true;

    return (
        <div className="min-h-screen text-white p-4 pt-44 pb-32">
            {isSearchVisible && <SearchModal products={products} onClose={() => setIsSearchVisible(false)} />}
            
            {/* Social Media Top Bar */}
            <div className="fixed top-0 left-0 right-0 z-[51] h-12 bg-black border-b border-orange-500/20 flex items-center justify-center gap-2 px-2 overflow-x-auto no-scrollbar shadow-md">
                {/* Facebook */}
                {isSocialVisible('facebook') && (
                    <a href="https://www.facebook.com/profile.php?id=61574578211637" target="_blank" rel="noopener noreferrer" onClick={(e) => handleSocialClick(e, 'facebook')} className={activeSocial === 'facebook' ? activeSocialClass : inactiveSocialClass} title="Facebook">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                    </a>
                )}
                {/* Instagram */}
                {isSocialVisible('instagram') && (
                    <a href="https://www.instagram.com/okestore900?igsh=YmtkdGJoZzdmcjkw" target="_blank" rel="noopener noreferrer" onClick={(e) => handleSocialClick(e, 'instagram')} className={activeSocial === 'instagram' ? activeSocialClass : inactiveSocialClass} title="Instagram">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                    </a>
                )}
                {/* WhatsApp */}
                {isSocialVisible('whatsapp') && (
                    <a href="https://whatsapp.com/channel/0029Vb7FDu9AojYwHURTIa1O" target="_blank" rel="noopener noreferrer" onClick={(e) => handleSocialClick(e, 'whatsapp')} className={activeSocial === 'whatsapp' ? activeSocialClass : inactiveSocialClass} title="WhatsApp">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                    </a>
                )}
                
                {/* Telegram */}
                {isSocialVisible('telegram') && (
                    <a href="https://t.me/okestore900" target="_blank" rel="noopener noreferrer" onClick={(e) => handleSocialClick(e, 'telegram')} className={activeSocial === 'telegram' ? activeSocialClass : inactiveSocialClass} title="Telegram">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                    </a>
                )}

                {/* YouTube */}
                {isSocialVisible('youtube') && (
                    <a href="https://youtube.com/channel/UCxqB37izN7qMWYPdl7dL1Nw?si=9qQXFlBGCKReFegv" target="_blank" rel="noopener noreferrer" onClick={(e) => handleSocialClick(e, 'youtube')} className={activeSocial === 'youtube' ? activeSocialClass : inactiveSocialClass} title="YouTube">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                    </a>
                )}
                {/* Atoplay */}
                {isSocialVisible('atoplay') && (
                    <a href="https://atoplay.com/channels/29ed49e6-cb02-42e2-8606-d9dcbaa75600" target="_blank" rel="noopener noreferrer" onClick={(e) => handleSocialClick(e, 'atoplay')} className={activeSocial === 'atoplay' ? activeSocialClass : inactiveSocialClass} title="Atoplay">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S17.627 0 12 0zm4.5 12.75l-7 4.5c-.5.3-1 .1-1-.5v-9c0-.6.5-.8 1-.5l7 4.5c.5.3.5.7 0 1z" /></svg>
                    </a>
                )}
                {/* Arratai */}
                {isSocialVisible('arratai') && (
                    <a href="https://chat.arattai.in/app/download" target="_blank" rel="noopener noreferrer" onClick={(e) => handleSocialClick(e, 'arratai')} className={activeSocial === 'arratai' ? activeSocialClass : inactiveSocialClass} title="Arratai">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" /></svg>
                    </a>
                )}
                {/* Share Link */}
                {isSocialVisible('share') && (
                    <button onClick={(e) => { handleShare(); handleSocialClick(e, 'share'); }} className={activeSocial === 'share' ? activeSocialClass : inactiveSocialClass} title="Share App">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" /></svg>
                    </button>
                )}
            </div>

            {/* New Ticker Bar */}
            <div className="fixed top-12 left-0 right-0 z-[50] h-10 bg-black flex items-center overflow-hidden border-b border-white/10">
                <div className="animate-marquee-custom text-sm font-bold px-4">
                    हमारे ऐप में आपका स्वागत है बहुत सारे pdf E-book डाउनलोड करें और इन pdf E-book को बेचकर कमाई शुरू करें समय-समय पर हम कोर्स अपडेट करते रहते हैं इसलिए ऊपर दिए गए सभी सोशल मीडिया अकाउंट को फॉलो और सब्सक्राइब कर लें धन्यवाद
                </div>
            </div>

            <header className="fixed top-[5.5rem] left-0 right-0 z-50 bg-gradient-to-r from-purple-900 via-black to-orange-900 backdrop-blur-md h-12 flex items-center justify-between px-2 sm:px-4 border-b border-orange-700/50 shadow-[0_2px_15px_rgba(249,115,22,0.4)]">
                <div className="flex items-center">
                    <Link to="/admin" className="flex items-center">
                        <img 
                            src="https://res.cloudinary.com/de2eehtiy/image/upload/v1765044615/logo_vnttdf.png" 
                            alt="Ok-E-store" 
                            className="h-8 w-auto object-contain" 
                        />
                    </Link>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setIsSearchVisible(true)} className={`flex flex-col items-center justify-center w-12 py-1 rounded-lg ${isSearchVisible ? activeIconClass : inactiveIconClass}`}>
                        <SearchIcon isActive={isSearchVisible} />
                        <span className="text-xs text-center font-medium mt-1">{t('search')}</span>
                    </button>
                    <Link to="/wishlist" className={`flex flex-col items-center justify-center w-12 py-1 rounded-lg ${location.pathname.startsWith('/wishlist') ? activeIconClass : inactiveIconClass}`}>
                        <div className="relative">
                            <HeartIcon isActive={location.pathname.startsWith('/wishlist')} />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center border border-black">{wishlist.length}</span>
                            )}
                        </div>
                        <span className="text-xs text-center font-medium mt-1">{t('wishlist')}</span>
                    </Link>
                    <button onClick={() => { setFlashOrder(false); handleProtectedLink('/orders'); }} className={`flex flex-col items-center justify-center w-12 py-1 rounded-lg ${location.pathname.startsWith('/orders') ? activeIconClass : inactiveIconClass} ${flashOrder ? 'animate-flash-green' : ''}`}>
                        <OrderIcon isActive={location.pathname.startsWith('/orders')} />
                        <span className="text-xs text-center font-medium mt-1">{t('my_orders')}</span>
                    </button>
                    <Link to="/cart" onClick={() => setFlashCart(false)} className={`flex flex-col items-center justify-center w-12 py-1 rounded-lg ${location.pathname.startsWith('/cart') ? activeIconClass : inactiveIconClass} ${flashCart ? 'animate-flash-green' : ''}`}>
                        <div className="relative">
                            <CartIcon isActive={location.pathname.startsWith('/cart')} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center border border-black">{cartItems.reduce((acc, item) => acc + item.quantity, 0) > 9 ? '9+' : cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                            )}
                        </div>
                        <span className="text-xs font-medium mt-1">{t('cart')}</span>
                    </Link>
                    <div className={`flex flex-col items-center justify-center w-12 py-1 text-center rounded-lg ${isNotifOpen ? activeIconClass : inactiveIconClass} ${flashNotif ? 'animate-flash-green' : ''}`}>
                        <NotificationBell notifications={notifications} onOpen={() => { setFlashNotif(false); setNotifications(prev => prev.map(n => ({ ...n, read: true }))); }} onClear={() => setNotifications([])} isOpen={isNotifOpen} onToggle={setIsNotifOpen} />
                        <span className="text-xs font-medium mt-1">{t('notifications')}</span>
                    </div>
                </div>
            </header>

            <div className="container mx-auto max-w-7xl">
                <Routes>
                    <Route path="/" element={<WelcomeScreen onStart={() => navigate('/home')} />} />
                    <Route path="/home" element={<SelectionScreen onSelect={handleSelectDivinationType} isPremiumActive={false} products={products} categoryVisibility={categoryVisibility} />} />
                    <Route path="/store" element={<PujanSamagriStore products={products} />} />
                    <Route path="/store/:categoryUrl" element={<PujanSamagriStore products={products} />} />
                    <Route path="/product/:productId" element={<ProductDetailScreen products={products} addToCart={addToCart} />} />
                    <Route path="/cart" element={<ShoppingCartScreen cartItems={cartItems} onUpdateQuantity={onUpdateCartQuantity} onRemoveItem={onRemoveCartItem} />} />
                    <Route path="/checkout" element={<CheckoutScreen cartItems={cartItems} onPlaceOrder={onPlaceOrder} onVerificationRequest={onVerificationRequest} />} />
                    <Route path="/orders" element={<OrderHistoryScreen orders={orders} />} />
                    <Route path="/orders/:orderId" element={<OrderConfirmationScreen orders={orders} />} />
                    <Route path="/profile" element={<ProfileScreen userProfile={currentUser} onUpdateProfile={updateProfile} />} />
                    <Route path="/settings" element={<SettingsScreen audioRef={audioRef} />} />
                    <Route path="/support" element={<SupportTicketScreen onCreateTicket={(ticket) => setSupportTickets(prev => [...prev, { ...ticket, id: `st-${Date.now()}`, status: 'Open', createdAt: new Date().toISOString() }])} />} />
                    <Route path="/admin" element={<AdminScreen products={products} onUpdateProducts={setProducts} orders={orders} onUpdateOrders={setOrders} pendingVerifications={pendingVerifications} onApproveVerification={onApproveVerification} supportTickets={supportTickets} onUpdateTicket={(t) => setSupportTickets(p => p.map(x => x.id === t.id ? t : x))} socialMediaPosts={socialMediaPosts} onCreatePost={(post) => setSocialMediaPosts(p => [...p, {...post, id: `sm-${Date.now()}`, createdAt: new Date().toISOString()}])} onUpdatePost={(post) => setSocialMediaPosts(p => p.map(x => x.id === post.id ? post : x))} onDeletePost={(postId) => setSocialMediaPosts(p => p.filter(x => x.id !== postId))} categoryVisibility={categoryVisibility} onUpdateCategoryVisibility={setCategoryVisibility} socialVisibility={socialVisibility} onUpdateSocialVisibility={setSocialVisibility} />} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/premium" element={<PremiumScreen onSelectPlan={handleSelectPlan} isTrialAvailable={true} onBack={() => navigate('/home')} />} />
                    <Route path="/subscribe" element={<SubscriptionPaymentScreen plan={selectedSubscriptionPlan} userProfile={currentUser} onVerificationRequest={(req) => { onVerificationRequest(req); navigate('/subscription-confirmed'); }} onBack={() => navigate('/premium')} />} />
                    <Route path="/subscription-confirmed" element={<SubscriptionConfirmationScreen expiryDate={null} />} />
                    <Route path="/wishlist" element={<WishlistScreen products={products} />} />
                    <Route path="/divination/:toolType" element={<DivinationScreen />} />
                </Routes>
            </div>

            <audio ref={audioRef} src="https://aistudio.google.com/static/sounds/background_music.mp3" loop autoPlay />
            
            <BottomNavBar cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} />

            <footer className="text-center text-xs text-orange-400/60 mt-12 pb-4">
                
                <div className="flex justify-center gap-4 mb-6">
                    <a 
                        href="https://whatsapp.com/channel/0029Vb7FDu9AojYwHURTIa1O"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-1.5 rounded-full bg-green-500/10 border border-green-500 text-green-400 font-bold text-xs uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-[0_0_10px_rgba(34,197,94,0.3)] inline-block"
                    >
                        Follow
                    </a>
                    <a 
                        href="https://youtube.com/channel/UCxqB37izN7qMWYPdl7dL1Nw?si=9qQXFlBGCKReFegv"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-1.5 rounded-full bg-red-600/10 border border-red-600 text-red-600 font-bold text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-[0_0_10px_rgba(220,38,38,0.3)] inline-block"
                    >
                        Subscribe
                    </a>
                </div>

                <div className="flex justify-center mb-4">
                    <img 
                        src="https://res.cloudinary.com/de2eehtiy/image/upload/v1765084945/3cc7bb1a-d113-4add-b199-0cb4a8406248_qlnfld.png" 
                        alt="Ok-E-store Banner" 
                        className="w-full max-w-sm rounded-lg shadow-lg border border-orange-500/30" 
                    />
                </div>
                <div className="flex justify-center items-center gap-4 mb-2">
                    <Link to="/terms" className="hover:text-orange-300 transition underline">{t('terms_and_conditions')}</Link>
                    <span className="text-orange-400/40">|</span>
                    <Link to="/privacy" className="hover:text-orange-300 transition underline">{t('privacy_policy')}</Link>
                </div>
                <p>{t('copyright')}</p>
            </footer>
        </div>
    );
};

export default AppComp;
