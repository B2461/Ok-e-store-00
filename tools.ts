
import { DivinationType, ShowcaseTool } from '../types';

export interface Tool {
    type: DivinationType;
    icon: string;
    isPremium?: boolean;
}

export interface ToolCategory {
    name: string;
    tools: Tool[];
}

export const toolCategories: ToolCategory[] = [
    {
        name: 'Shopping Store',
        tools: [
            { type: DivinationType.PUJAN_SAMAGRI, icon: '🛍️' },
            { type: DivinationType.TANTRA_MANTRA_YANTRA_EBOOK, icon: '📚' },
            { type: DivinationType.GEMS_JEWELRY, icon: '💎' },
            { type: DivinationType.MOBILE_ACCESSORIES, icon: '📱' },
            { type: DivinationType.LADIES_GENTS_BABY_SHOES, icon: '👟' },
            { type: DivinationType.LADIES_GENTS_ACCESSORIES, icon: '👜' },
        ]
    },
    {
        name: 'Admin',
        tools: [
            { type: DivinationType.ADMIN_PANEL, icon: '⚙️' },
        ]
    }
];

export const showcaseTools: ShowcaseTool[] = [
    {
        type: DivinationType.TANTRA_MANTRA_YANTRA_EBOOK,
        icon: '📚',
        description: 'Tantra Mantra Yantra PDF E-book Special Offer',
        descriptionHi: 'तंत्र मंत्र यंत्र पीडीएफ ई-बुक विशेष ऑफर',
        motivationalText: 'Limited Time Deal',
        motivationalTextHi: 'सीमित समय के लिए डील',
        // Image removed
    },
    {
        type: DivinationType.TANTRA_MANTRA_YANTRA_EBOOK,
        icon: '📕',
        description: 'Vashikaran & Attraction Secrets. Get the PDF now.',
        descriptionHi: 'वशीकरण और आकर्षण के रहस्य। अभी पीडीएफ प्राप्त करें।',
        motivationalText: 'Control your destiny.',
        motivationalTextHi: 'अपनी नियति को नियंत्रित करें।'
    },
    {
        type: DivinationType.MOBILE_ACCESSORIES,
        icon: '🎧',
        description: 'Premium Wireless Earbuds. Deep bass, long battery.',
        descriptionHi: 'प्रीमियम वायरलेस ईयरबड्स। शानदार साउंड, लंबी बैटरी।',
        motivationalText: 'Feel the music.',
        motivationalTextHi: 'संगीत को महसूस करें।'
    },
    {
        type: DivinationType.DIVINATION_STORE,
        icon: '👑',
        description: 'Get VIP Access. Download all E-books for FREE.',
        descriptionHi: 'वीआईपी एक्सेस प्राप्त करें। सभी ई-बुक्स मुफ्त में डाउनलोड करें।',
        motivationalText: 'Join the Premium Club.',
        motivationalTextHi: 'प्रीमियम क्लब में शामिल हों।'
    },
    {
        type: DivinationType.TANTRA_MANTRA_YANTRA_EBOOK,
        icon: '📈',
        description: '80+ Marketing Courses & Softwares. Boom your business.',
        descriptionHi: '80+ मार्केटिंग कोर्स और सॉफ्टवेयर। अपना बिजनेस बढ़ाएं।',
        motivationalText: 'Become a marketing guru.',
        motivationalTextHi: 'मार्केटिंग गुरु बनें।'
    },
    {
        type: DivinationType.MOBILE_ACCESSORIES,
        icon: '🤳',
        description: 'Bluetooth Selfie Stick with Tripod. Capture perfect shots.',
        descriptionHi: 'ब्लूटूथ सेल्फी स्टिक (ट्राइपॉड के साथ)। बेहतरीन फोटो लें।',
        motivationalText: 'Capture every moment.',
        motivationalTextHi: 'हर पल को कैद करें।'
    },
    {
        type: DivinationType.TANTRA_MANTRA_YANTRA_EBOOK,
        icon: '📊',
        description: 'Master the Stock Market. Learn trading strategies.',
        descriptionHi: 'शेयर बाजार में महारत हासिल करें। ट्रेडिंग के तरीके सीखें।',
        motivationalText: 'Build your wealth.',
        motivationalTextHi: 'अपनी दौलत बढ़ाएं।'
    },
    {
        type: DivinationType.LADIES_GENTS_BABY_SHOES,
        icon: '👟',
        description: 'Trendy Shoes for Men & Women. Comfort meets style.',
        descriptionHi: 'पुरुषों और महिलाओं के लिए ट्रेंडी जूते। आराम और स्टाइल।',
        motivationalText: 'Step up your game.',
        motivationalTextHi: 'अपना स्टाइल बढ़ाएं।'
    },
    {
        type: DivinationType.GEMS_JEWELRY,
        icon: '💎',
        description: 'Exquisite Gems & Jewelry. Shine bright like a diamond.',
        descriptionHi: 'बेहतरीन रत्न और आभूषण। हीरे की तरह चमकें।',
        motivationalText: 'Enhance your beauty.',
        motivationalTextHi: 'अपनी सुंदरता बढ़ाएं।'
    },
    {
        type: DivinationType.TANTRA_MANTRA_YANTRA_EBOOK,
        icon: '🏡',
        description: 'Vastu Shastra Complete Guide. Fix home energy.',
        descriptionHi: 'वास्तु शास्त्र सम्पूर्ण गाइड। घर की ऊर्जा ठीक करें।',
        motivationalText: 'Live in harmony.',
        motivationalTextHi: 'सुख-शांति से रहें।'
    },
    {
        type: DivinationType.MOBILE_ACCESSORIES,
        icon: '🦜',
        description: 'Talking Parrot Toy for Kids. Repeats what you say.',
        descriptionHi: 'बच्चों के लिए बोलने वाला तोता। आपकी बातें दोहराता है।',
        motivationalText: 'Fun for kids.',
        motivationalTextHi: 'बच्चों के लिए मजेदार।'
    },
    {
        type: DivinationType.TANTRA_MANTRA_YANTRA_EBOOK,
        icon: '🧘',
        description: 'Yoga & Ayurveda PDF. Ancient health secrets.',
        descriptionHi: 'योग और आयुर्वेद पीडीएफ। प्राचीन स्वास्थ्य रहस्य।',
        motivationalText: 'Health is wealth.',
        motivationalTextHi: 'स्वास्थ्य ही धन है।'
    },
    {
        type: DivinationType.TANTRA_MANTRA_YANTRA_EBOOK,
        icon: '💻',
        description: 'Computer Fundamentals Guide. Basics to Advanced.',
        descriptionHi: 'कंप्यूटर फंडामेंटल्स गाइड। बेसिक से एडवांस तक।',
        motivationalText: 'Upgrade your skills.',
        motivationalTextHi: 'अपना कौशल बढ़ाएं।'
    },
    {
        type: DivinationType.DIVINATION_STORE,
        icon: '⚡',
        description: 'Instant PDF Downloads with Premium Plan. No waiting.',
        descriptionHi: 'प्रीमियम प्लान के साथ तुरंत पीडीएफ डाउनलोड।',
        motivationalText: 'Save time, Learn more.',
        motivationalTextHi: 'समय बचाएं, अधिक सीखें।'
    },
    {
        type: DivinationType.TANTRA_MANTRA_YANTRA_EBOOK,
        icon: '🏢',
        description: 'Real Estate Mastery. Buying and selling secrets.',
        descriptionHi: 'रियल एस्टेट मास्टरी। खरीदने और बेचने के रहस्य।',
        motivationalText: 'Invest smart.',
        motivationalTextHi: 'समझदारी से निवेश करें।'
    },
    {
        type: DivinationType.TANTRA_MANTRA_YANTRA_EBOOK,
        icon: '🗣️',
        description: 'English Speaking Course. Speak fluently today.',
        descriptionHi: 'इंग्लिश स्पीकिंग कोर्स। आज ही फर्राटेदार बोलें।',
        motivationalText: 'Speak with confidence.',
        motivationalTextHi: 'आत्मविश्वास से बोलें।'
    },
    {
        type: DivinationType.TANTRA_MANTRA_YANTRA_EBOOK,
        icon: '🎬',
        description: 'Viral Reels Bundle. Grow your Instagram fast.',
        descriptionHi: 'वायरल रील्स बंडल। अपना इंस्टाग्राम तेजी से बढ़ाएं।',
        motivationalText: 'Go viral today.',
        motivationalTextHi: 'आज ही वायरल हो जाएं।'
    },
    {
        type: DivinationType.TANTRA_MANTRA_YANTRA_EBOOK,
        icon: '💾',
        description: 'Resell Digital Products. Start online business.',
        descriptionHi: 'डिजिटल उत्पाद बेचें। ऑनलाइन बिजनेस शुरू करें।',
        motivationalText: 'Earn passive income.',
        motivationalTextHi: 'पैसे कमाएं।'
    },
    {
        type: DivinationType.TANTRA_MANTRA_YANTRA_EBOOK,
        icon: '✏️',
        description: '500+ Kids Worksheets. Brain development activities.',
        descriptionHi: '500+ बच्चों की वर्कशीट। दिमाग तेज करने वाली गतिविधियां।',
        motivationalText: 'Smart parenting.',
        motivationalTextHi: 'स्मार्ट पेरेंटिंग।'
    },
    {
        type: DivinationType.TANTRA_MANTRA_YANTRA_EBOOK,
        icon: '🕉️',
        description: 'Tantra Mantra Yantra. Ancient spiritual power.',
        descriptionHi: 'तंत्र मंत्र यंत्र। प्राचीन आध्यात्मिक शक्ति।',
        motivationalText: 'Unleash inner power.',
        motivationalTextHi: 'आंतरिक शक्ति को जगाएं।'
    }
];
