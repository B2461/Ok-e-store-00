
import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import { useAppContext } from '../App';
import AudioPlayer from './AudioPlayer';

interface SettingsScreenProps {
    audioRef: React.RefObject<HTMLAudioElement>;
}

const themes = [
    { id: 'cosmic', name: 'ब्रह्मांडीय रात्रि', emoji: '🌌' },
    { id: 'sunrise', name: 'गोधूलि बेला', emoji: '🌆' },
    { id: 'forest', name: 'रात्रि वन', emoji: '🌲' },
    { id: 'saffron', name: 'गहरा भगवा', emoji: '🟠' },
    { id: 'light', name: 'सरल सफेद', emoji: '☀️' },
    { id: 'dark', name: 'सरल काला', emoji: '🌑' },
    { id: 'rose', name: 'गुलाबी', emoji: '🌹' },
    { id: 'sky', name: 'आसमानी', emoji: '🌃' },
    { id: 'emerald', name: 'हरा', emoji: '🌿' },
    { id: 'grey', name: 'स्लेटी', emoji: '🌫️' },
];

const themeColors: Record<string, { frame: number[], toolbar: number[], ntp_background: number[], ntp_text: number[] }> = {
    cosmic: { frame: [5, 2, 0], toolbar: [20, 10, 5], ntp_background: [5, 2, 0], ntp_text: [255, 153, 51] },
    sunrise: { frame: [5, 4, 16], toolbar: [25, 23, 52], ntp_background: [5, 4, 16], ntp_text: [255, 255, 255] },
    forest: { frame: [16, 28, 19], toolbar: [5, 7, 5], ntp_background: [16, 28, 19], ntp_text: [200, 255, 200] },
    saffron: { frame: [48, 18, 2], toolbar: [249, 115, 22], ntp_background: [48, 18, 2], ntp_text: [253, 186, 116] },
    light: { frame: [249, 250, 251], toolbar: [255, 255, 255], ntp_background: [249, 250, 251], ntp_text: [31, 41, 55] },
    dark: { frame: [0, 0, 0], toolbar: [30, 30, 30], ntp_background: [0, 0, 0], ntp_text: [255, 255, 255] },
    rose: { frame: [59, 4, 20], toolbar: [80, 10, 30], ntp_background: [59, 4, 20], ntp_text: [255, 200, 220] },
    sky: { frame: [6, 34, 53], toolbar: [10, 50, 80], ntp_background: [6, 34, 53], ntp_text: [200, 230, 255] },
    emerald: { frame: [1, 31, 24], toolbar: [5, 50, 40], ntp_background: [1, 31, 24], ntp_text: [200, 255, 230] },
    grey: { frame: [31, 41, 55], toolbar: [55, 65, 81], ntp_background: [31, 41, 55], ntp_text: [229, 231, 235] },
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ audioRef }) => {
    const { language, setLanguage, theme, setTheme, t } = useAppContext();

    const handleDownloadTheme = (e: React.MouseEvent, themeId: string, themeName: string) => {
        e.stopPropagation();
        
        const colors = themeColors[themeId];
        if (!colors) return;

        const manifest = {
            manifest_version: 3,
            version: "1.0",
            name: `Ok-E-Store ${themeName} Theme`,
            description: `A custom Chrome theme based on the ${themeName} theme from Ok-E-Store.`,
            theme: {
                colors: {
                    frame: colors.frame,
                    toolbar: colors.toolbar,
                    ntp_background: colors.ntp_background,
                    ntp_text: colors.ntp_text,
                    tab_text: colors.ntp_text,
                    tab_background_text: colors.ntp_text,
                    bookmark_text: colors.ntp_text,
                }
            }
        };

        const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'manifest.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`'${themeName}' थीम डाउनलोड हो गई है!\n\nइसे Chrome ब्राउज़र में लगाने के लिए:\n1. एक नया फोल्डर बनाएं और डाउनलोड की गई 'manifest.json' फाइल को उसमें रखें।\n2. Chrome में 'chrome://extensions' खोलें।\n3. ऊपर दाईं ओर 'Developer mode' चालू करें।\n4. 'Load unpacked' पर क्लिक करें और उस फोल्डर को चुनें।`);
    };

    return (
        <Card className="animate-fade-in max-w-2xl mx-auto">
            <Link to="/" className="absolute top-6 left-6 text-orange-300 hover:text-white transition">&larr; {t('back')}</Link>
            <h2 className="text-3xl font-hindi font-bold mb-8 text-center">{t('settings')}</h2>

            <div className="space-y-8">
                
                {/* Music/Sound Control */}
                <div>
                    <label className="block text-orange-200 text-lg mb-3">{t('music')}</label>
                    <div className="flex items-center justify-center p-4 bg-white/10 rounded-lg">
                         <AudioPlayer audioRef={audioRef} size="lg" />
                    </div>
                </div>

                {/* Language Selection */}
                <div>
                    <label className="block text-orange-200 text-lg mb-3">{t('select_language')}</label>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setLanguage('hi')}
                            className={`w-full py-3 rounded-lg border-2 font-semibold transition ${language === 'hi' ? 'bg-orange-600 border-orange-400 text-white' : 'bg-white/10 border-white/20 text-orange-200'}`}
                        >
                            हिन्दी
                        </button>
                        <button 
                            onClick={() => setLanguage('en')}
                            className={`w-full py-3 rounded-lg border-2 font-semibold transition ${language === 'en' ? 'bg-orange-600 border-orange-400 text-white' : 'bg-white/10 border-white/20 text-orange-200'}`}
                        >
                            English
                        </button>
                    </div>
                </div>

                {/* Theme Selection */}
                <div>
                    <label className="block text-orange-200 text-lg mb-3">{t('select_theme')}</label>
                    <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
                        {themes.map(themeItem => (
                            <div key={themeItem.id} className="relative group">
                                <button
                                    onClick={() => setTheme(themeItem.id)}
                                    className={`w-full h-full flex flex-col items-center justify-center p-4 aspect-square rounded-lg border-2 transition ${theme === themeItem.id ? 'bg-orange-600 border-orange-400' : 'bg-white/10 border-white/20 hover:border-orange-400'}`}
                                >
                                    <span className="text-3xl mb-2">{themeItem.emoji}</span>
                                    <span className="text-sm font-semibold text-center">{themeItem.name}</span>
                                </button>
                                <button
                                    onClick={(e) => handleDownloadTheme(e, themeItem.id, themeItem.name)}
                                    className="absolute top-1 right-1 p-1.5 bg-black/40 hover:bg-green-600 rounded-full text-white/70 hover:text-white transition backdrop-blur-sm z-10 shadow-lg"
                                    title={`Download ${themeItem.name} for Chrome`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/20 text-center">
                <Link to="/terms" className="text-purple-300 hover:text-white underline">{t('terms_and_conditions')}</Link>
                <span className="mx-4 text-purple-400/60">|</span>
                <Link to="/privacy" className="text-purple-300 hover:text-white underline">{t('privacy_policy')}</Link>
            </div>
        </Card>
    );
};

export default SettingsScreen;
