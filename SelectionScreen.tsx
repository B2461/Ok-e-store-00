import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DivinationType, Product } from '../types';
import ToolShowcaseSlider from './ToolShowcaseSlider';
import { useAppContext } from '../App';
import ProductShowcaseSlider from './ProductShowcaseSlider';
import TrendingVideoCollection from './TrendingVideoCollection';
import Card from './Card';

interface SelectionScreenProps {
    onSelect: (type: DivinationType) => void;
    isPremiumActive: boolean;
    products: Product[];
    categoryVisibility: Record<string, boolean>;
}

// Local Grid Product Card component
const GridProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const discountedPrice = product.mrp - (product.mrp * product.discountPercentage / 100);
    const { wishlist, toggleWishlist } = useAppContext();
    const isLiked = wishlist.includes(product.id);

    return (
        <div className="group block w-full relative">
            <Card className="p-2 h-full flex flex-col justify-between !bg-white/5 hover:!bg-purple-500/10 active:!bg-amber-500/20 active:!border-amber-400 active:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-300">
                <div className="relative overflow-hidden rounded-lg mb-2 icon-glow-saffron bg-black/20 aspect-square flex items-center justify-center">
                    <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
                        <img
                            src={product.imageUrl1}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                    </Link>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product.id);
                        }}
                        className="absolute top-1 right-1 z-10 p-1 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors ${isLiked ? 'text-pink-500 fill-pink-500' : 'text-white/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isLiked ? 0 : 2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
                <Link to={`/product/${product.id}`}>
                    <div>
                        <h3 className="text-xs sm:text-sm font-hindi font-bold text-white truncate">{product.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 mt-1">
                            <p className="text-sm sm:text-base font-bold text-pink-400">₹{discountedPrice.toFixed(0)}</p>
                            {product.discountPercentage > 0 && (
                                <p className="text-[10px] text-purple-300 line-through">₹{product.mrp.toFixed(0)}</p>
                            )}
                        </div>
                    </div>
                </Link>
            </Card>
        </div>
    );
};

const ProductShowcaseGrid: React.FC<{ title: string; products: Product[]; viewAllLink: string }> = ({ title, products, viewAllLink }) => {
    if (products.length === 0) return null;
    return (
        <div className="text-left mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-xl font-hindi font-bold text-purple-300 border-b-2 border-purple-500/20 pb-2">
                    {title}
                </h3>
                <Link to={viewAllLink} className="text-xs text-purple-300 hover:text-white transition font-semibold">
                    सभी देखें &rarr;
                </Link>
            </div>
            {/* Changed from grid-cols-3 to grid-cols-2 */}
            <div className="grid grid-cols-2 gap-3 px-2">
                {products.map(product => (
                    <GridProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect, isPremiumActive, products, categoryVisibility }) => {
    const { tDiv, t } = useAppContext();

    // Helper to check if a category is visible (defaults to true if not set)
    const isVisible = (key: string) => categoryVisibility[key] !== false;

    // -- Split products into distinct categories --
    
    const ebookProducts = useMemo(() => 
        products.filter(p => p.category === 'Tantra Mantra Yantra E-book'),
    [products]);

    const pujanProducts = useMemo(() => 
        products.filter(p => p.category === 'Pujan Samagri'),
    [products]);

    const gemsProducts = useMemo(() => 
        products.filter(p => p.category === 'Gems & Jewelry'),
    [products]);

    const mobileProducts = useMemo(() => 
        products.filter(p => p.category === 'Mobile Accessories'),
    [products]);

    const shoesProducts = useMemo(() => 
        products.filter(p => p.category === 'Shoes'),
    [products]);

    const accessoriesProducts = useMemo(() => 
        products.filter(p => p.category === 'Accessories'),
    [products]);

    const categoryGridItems = [
        { 
            id: 'product_pujan', 
            titleEn: 'WORSHIP ITEMS', 
            titleHi: 'पूजन सामग्री', 
            icon: '🛍️', 
            link: '/store/pujan-samagri' 
        },
        { 
            id: 'product_ebooks', 
            titleEn: 'PDF E-BOOKS', 
            titleHi: 'तंत्र मंत्र यन्त्र PDF E-book', 
            icon: '📚', 
            link: '/store/ebooks' 
        },
        { 
            id: 'product_gems', 
            titleEn: 'GEMS & JEWELRY', 
            titleHi: 'रत्न आभूषण', 
            icon: '💎', 
            link: '/store/gems-jewelry' 
        },
        { 
            id: 'product_mobile', 
            titleEn: 'MOBILE ACCESSORIES', 
            titleHi: 'मोबाइल एक्सेसरीज', 
            icon: '📱', 
            link: '/store/mobile-accessories' 
        },
        { 
            id: 'product_shoes', 
            titleEn: 'SHOES', 
            titleHi: 'लेडीज जेंट्स एंड बेबी शूज', 
            icon: '👟', 
            link: '/store/shoes' 
        },
        { 
            id: 'product_accessories', 
            titleEn: 'ACCESSORIES', 
            titleHi: 'लेडीज एंड जेंट्स पर्स बैग बेल्ट', 
            icon: '👜', 
            link: '/store/accessories' 
        }
    ];

    return (
        <div className="text-center animate-fade-in w-full mt-4">
            
            <ToolShowcaseSlider onSelect={onSelect} />

            {/* Main Category Grid - Dark Theme */}
            <div className="max-w-6xl mx-auto px-4 mb-6">
                <h2 className="text-2xl font-hindi font-bold text-purple-300 text-left mb-6 ml-1">मुख्य श्रेणियाँ</h2>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    {categoryGridItems.map(cat => (
                        isVisible(cat.id) && (
                            <Link key={cat.id} to={cat.link} className="block group">
                                <div className="h-full flex flex-col items-center justify-center p-2 sm:p-4 bg-[#1c1c1e] border border-white/10 rounded-2xl transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20 active:bg-amber-500/20 active:border-amber-400 active:shadow-[0_0_20px_rgba(251,191,36,0.3)] aspect-[4/5] sm:aspect-[3/4]">
                                    <div className="flex-grow flex items-center justify-center">
                                        <span className="text-3xl sm:text-5xl transform group-hover:scale-110 transition-transform duration-300 icon-glow-saffron">{cat.icon}</span>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <span className="block text-[10px] sm:text-sm font-bold text-white tracking-wider mb-0.5 sm:mb-1 uppercase leading-tight">{cat.titleEn}</span>
                                        <span className="block text-[8px] sm:text-xs text-gray-400 font-hindi leading-tight">{cat.titleHi}</span>
                                    </div>
                                </div>
                            </Link>
                        )
                    ))}
                </div>
            </div>

            <div className="space-y-12 mb-12">
                {/* PDF E-Books - Changed to Grid */}
                {isVisible('product_ebooks') && (
                    <ProductShowcaseGrid
                        title={tDiv(DivinationType.TANTRA_MANTRA_YANTRA_EBOOK).hi}
                        products={ebookProducts}
                        viewAllLink="/store/ebooks"
                    />
                )}

                {/* Mobile Accessories - Changed to Grid */}
                {isVisible('product_mobile') && (
                    <ProductShowcaseGrid
                        title={tDiv(DivinationType.MOBILE_ACCESSORIES).hi}
                        products={mobileProducts}
                        viewAllLink="/store/mobile-accessories"
                    />
                )}

                {/* Other Categories remain as Sliders */}
                {isVisible('product_pujan') && (
                    <ProductShowcaseSlider
                        title={tDiv(DivinationType.PUJAN_SAMAGRI).hi}
                        products={pujanProducts}
                        viewAllLink="/store/pujan-samagri"
                    />
                )}

                {isVisible('product_gems') && (
                    <ProductShowcaseSlider
                        title={tDiv(DivinationType.GEMS_JEWELRY).hi}
                        products={gemsProducts}
                        viewAllLink="/store/gems-jewelry"
                    />
                )}

                {isVisible('product_shoes') && (
                    <ProductShowcaseSlider
                        title={tDiv(DivinationType.LADIES_GENTS_BABY_SHOES).hi}
                        products={shoesProducts}
                        viewAllLink="/store/shoes"
                    />
                )}

                {isVisible('product_accessories') && (
                    <ProductShowcaseSlider
                        title={tDiv(DivinationType.LADIES_GENTS_ACCESSORIES).hi}
                        products={accessoriesProducts}
                        viewAllLink="/store/accessories"
                    />
                )}
            </div>

            {/* Trending Video Collection Section - Moved below product sliders */}
            <TrendingVideoCollection products={products} />
        </div>
    );
};

export default SelectionScreen;