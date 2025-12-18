import React, { useState, useRef, useEffect } from 'react';
import { Reading, DivinationType } from '../types';
import Card from './Card';
import { generateSpeech } from '../services/geminiService';
import { useAppContext } from '../App';

// Audio decoding functions
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const sampleRate = 24000;
  const numChannels = 1;
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Creates a WAV file blob from raw PCM data.
const pcmToWavBlob = (pcmData: Uint8Array, sampleRate: number, numChannels: number, bitsPerSample: number): Blob => {
    const dataSize = pcmData.length;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    };

    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // 1 = PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    const pcmView = new Uint8Array(buffer, 44);
    pcmView.set(pcmData);
    
    return new Blob([view], { type: 'audio/wav' });
};


interface ResultDisplayProps {
    reading: Reading | null;
    divinationType: DivinationType;
    onReset: () => void;
    onSave: () => void;
    isSaved: boolean;
}

const getTitlesForType = (type: DivinationType): { main: string; past: string; present: string; future: string; icons: string[] } => {
    // Basic defaults
    let titles = { main: 'Reading', past: 'Your Past', present: 'Your Present', future: 'Your Future', icons: ['📜', '🔮', '✨'] };

    switch (type) {
        case DivinationType.PILGRIMAGE:
            titles = { main: 'Details', past: 'History & Significance', present: 'Current Form & Story', future: 'Spiritual Guidance', icons: ['📜', '🏛️', '🕊️'] };
            break;
        case DivinationType.ZODIAC:
            titles = { main: 'Zodiac Reading', past: 'Nature & Personality', present: 'Positive Traits & Strengths', future: 'Challenges & Areas for Growth', icons: ['👤', '✨', '💪'] };
            break;
        case DivinationType.DAILY_HOROSCOPE:
            titles = { main: 'Daily Horoscope', past: 'Theme of the Day', present: 'Detailed Horoscope', future: 'Advice for the Day', icons: ['☀️', '🔍', '💡'] };
            break;
        case DivinationType.HOROSCOPE:
            titles = { main: 'Horoscope', past: 'Overview & Main Theme', present: 'Detailed Horoscope', future: 'Advice & Remedies', icons: ['📅', '🔍', '💡'] };
            break;
        case DivinationType.DAILY_FORTUNE_CARD:
            titles = { main: 'Fortune Card', past: 'Theme of the Day', present: 'Fortune for Today', future: 'Mantra for the Day', icons: ['🌟', '🥠', '🧘'] };
            break;
        case DivinationType.DREAM:
            titles = { main: 'Dream Interpretation', past: 'Symbolism of the Dream', present: 'Connection to Current Life', future: 'Guidance for the Future', icons: ['📖', '🧘', '🧭'] };
            break;
        case DivinationType.TRAVEL:
            titles = { main: 'Travel Forecast', past: 'Pre-Journey Thoughts', present: 'During the Journey', future: 'Outcome of the Journey', icons: ['🎒', '✈️', '✅'] };
            break;
        case DivinationType.TRAIN_JOURNEY:
            titles = { main: 'Train Journey Details', past: 'Route Information', present: 'List of Trains', future: 'Travel Tips & Ticket Price', icons: ['📜', '🚂', '💰'] };
            break;
        case DivinationType.MOLE:
            titles = { main: 'Mole Astrology', past: 'General Meaning of the Mole', present: 'Benefits (Fayde)', future: 'Harms (Nuksan)', icons: ['📖', '✅', '❌'] };
            break;
        case DivinationType.LOVE_RELATIONSHIP:
            titles = { main: 'Love Relationship Analysis', past: 'Past of the Relationship', present: 'Current Situation', future: 'Future Possibilities', icons: ['🌱', '💖', '✨'] };
            break;
        case DivinationType.MARRIAGE_COMPATIBILITY:
            titles = { main: 'Marriage Compatibility Report', past: 'Core Compatibility & Guna Milan', present: 'Strengths & Weaknesses of the Union', future: 'Future & Remedies', icons: ['📜', '💑', '✨'] };
            break;
        case DivinationType.LOVE_COMPATIBILITY:
            titles = { main: 'Love Compatibility Report', past: 'Basis of Attraction', present: 'Current Relationship', future: 'Future Potential', icons: ['💕', '📊', '💖'] };
            break;
        case DivinationType.TAROT:
            titles = { main: 'Reading', past: 'Your Past', present: 'Your Present', future: 'Your Future', icons: ['📜', '🔮', '✨'] };
            break;
        case DivinationType.JANAM_KUNDLI:
            titles = { main: 'Kundli Analysis', past: 'Personality & Planetary Positions', present: 'Current Dasha & Effects', future: 'Predictions & Remedies', icons: ['👤', '⏳', '✨'] };
            break;
        case DivinationType.SEASONAL_FOOD:
            titles = { main: 'Food Guide', past: 'What to Eat', present: 'What to Avoid', future: 'General Health Tips', icons: ['🥗', '🚫', '❤️'] };
            break;
        case DivinationType.ANG_SPHURAN:
            titles = { main: 'Body Twitching Results', past: 'General Meaning (Male-Female)', present: 'Auspicious Results', future: 'Inauspicious Results', icons: ['📖', '👍', '👎'] };
            break;
        case DivinationType.SNEEZING:
            titles = { main: 'Sneeze Interpretation', past: 'General Meaning of Sneeze', present: 'Beneficial Results', future: 'Harmful Results', icons: ['🤧', '✅', '❌'] };
            break;
        case DivinationType.BUSINESS_ASTROLOGY:
            titles = { main: 'Business Astrology Analysis', past: 'Your Business Potential', present: 'Suitable Business Sectors', future: 'Tips for Success', icons: ['👤', '💼', '💡'] };
            break;
        case DivinationType.FOOD_COMBINATION:
            titles = { main: 'Food Combination Analysis', past: 'What to Eat Together', present: 'What Not to Eat Together', future: 'General Health Tips', icons: ['✅', '❌', '❤️'] };
            break;
        case DivinationType.RELIGIOUS_RITUALS:
            titles = { main: 'Religious Information', past: 'History & Significance', present: 'Method / Text', future: 'Benefits & Spiritual Gain', icons: ['📜', '📖', '✨'] };
            break;
        case DivinationType.PRASHNA_PARIKSHA:
            titles = { main: 'Analysis', past: 'Context of the Past', present: 'Current Situation', future: 'Indication for the Future', icons: ['📜', '🤔', '✨'] };
            break;
        case DivinationType.PRASHNA_CHAKRA:
            titles = { main: 'Answer', past: 'Your Question', present: "The Chakra's Answer", future: 'Guidance', icons: ['❓', '☸️', '💡'] };
            break;
        case DivinationType.FAMOUS_PLACE_TRAVEL:
            titles = { main: 'Travel Information', past: 'History & Significance of the Place', present: 'Travel Information', future: 'Tips & Advice', icons: ['📜', '🗺️', '💡'] };
            break;
        case DivinationType.ENGLISH_GURU:
            titles = { main: 'Analysis', past: 'English Translation', present: 'Grammar Explanation', future: 'Vocabulary and Tips', icons: ['🇬🇧', '📖', '💡'] };
            break;
        case DivinationType.SCAN_TRANSLATE:
            titles = { main: 'Translation Result', past: 'Original Text', present: 'Translated Text', future: 'Notes', icons: ['📝', '🌐', '💡'] };
            break;
        case DivinationType.TEXT_TO_IMAGE:
            titles = { main: 'Image', past: 'Description', present: 'Your Prompt', future: 'Next Steps', icons: ['🖼️', '✍️', '💡'] };
            break;
        case DivinationType.STORY_TO_VIDEO:
            titles = { main: 'Story Video', past: 'Your Script', present: 'Generated Video', future: 'Next Steps', icons: ['📜', '🎬', '💡'] };
            break;
        case DivinationType.IMAGE_TO_VIDEO:
            titles = { main: 'Video', past: 'Your Original Image', present: 'Generated Video', future: 'Next Steps', icons: ['🖼️', '🎬', '💡'] };
            break;
        case DivinationType.VASTU_SHASTRA:
            titles = { main: 'Vastu Analysis', past: 'Vastu Principles', present: 'Analysis of Your Situation', future: 'Suggestions & Remedies', icons: ['📜', '🏡', '💡'] };
            break;
        case DivinationType.AI_FACE_READING:
            titles = { main: 'Face Analysis', past: 'Personality & Nature', present: 'Strengths & Weaknesses', future: 'Potential & Guidance', icons: ['👤', '💪', '💡'] };
            break;
        case DivinationType.AI_TIME_MACHINE:
            titles = { main: 'Time Machine', past: 'Based on your current image', present: 'Your future in 10 years', future: 'Guidance', icons: ['👤', '⏳', '💡'] };
            break;
        case DivinationType.AI_FUTURE_GENERATOR:
            titles = { main: 'Prediction', past: 'Origin of the Question', present: 'Current Energies', future: 'Guidance for the Future', icons: ['❓', '⚡', '🌟'] };
            break;
        case DivinationType.AI_CALCULATOR:
            titles = { main: 'Math Solution', past: 'Problem Understanding', present: 'Step-by-Step Solution', future: 'Final Answer', icons: ['🧮', '📝', '✅'] };
            break;
        case DivinationType.OBJECT_COUNTER:
            titles = { main: 'Object Counting', past: 'Object Identified', present: 'Count', future: 'Summary', icons: ['🧐', '🔢', '📝'] };
            break;
        default:
            // Fallback used above
            break;
    }
    return titles;
};

const ResultSection: React.FC<{ title: string; content: string; icon: string; }> = ({ title, content, icon }) => (
    <div className="mb-6">
        <h3 className="flex items-center gap-3 text-2xl font-hindi font-bold text-purple-300 mb-2">
            <span className="text-3xl">{icon}</span>
            {title}
        </h3>
        <p className="text-lg text-white/90 whitespace-pre-wrap">{content}</p>
    </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ reading, divinationType, onReset, onSave, isSaved }) => {
    const { t } = useAppContext();
    const titles = getTitlesForType(divinationType);
    const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);

    useEffect(() => {
        let objectUrl: string | undefined;
        if ((divinationType === DivinationType.STORY_TO_VIDEO || divinationType === DivinationType.IMAGE_TO_VIDEO) && reading?.videoDownloadUrl) {
            if (reading.videoUrl) {
                setVideoBlobUrl(reading.videoUrl);
            }
        }
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [reading, divinationType]);

    useEffect(() => {
        return () => {
            if (audioSourceRef.current) {
                audioSourceRef.current.stop();
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    if (!reading) return null;

    const handleSpeak = async () => {
        if (isSpeaking && audioSourceRef.current) {
            audioSourceRef.current.stop();
            setIsSpeaking(false);
            return;
        }

        if (isGeneratingSpeech) return;

        setIsGeneratingSpeech(true);
        try {
            const cardInfo = (divinationType === DivinationType.TAROT && reading.cardName) ? `Your Card: ${reading.cardName}.` : '';
            const textToSpeak = [
                cardInfo,
                `${titles.past}. ${reading.past}.`,
                `${titles.present}. ${reading.present}.`,
                `${titles.future}. ${reading.future}.`
            ].filter(Boolean).join(' ');
            
            const base64Audio = await generateSpeech(textToSpeak);
            
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                audioContextRef.current = new AudioContext({ sampleRate: 24000 });
            }
            
            const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            
            source.onended = () => {
                setIsSpeaking(false);
                audioSourceRef.current = null;
            };

            source.start();
            audioSourceRef.current = source;
            setIsSpeaking(true);

        } catch (err) {
            console.error("Failed to play audio:", err);
            alert("ऑडियो चलाने में विफल रहा।");
        } finally {
            setIsGeneratingSpeech(false);
        }
    };

    const handleShare = async () => {
        const cardInfo = divinationType === DivinationType.TAROT && reading.cardName ? `My Card: ${reading.cardName}\n\n` : '';
        const textToShare = `
My ${divinationType} ${titles.main}:
${cardInfo}
${titles.icons[0]} ${titles.past}
${reading.past}
---
${titles.icons[1]} ${titles.present}
${divinationType === DivinationType.STORY_TO_VIDEO || divinationType === DivinationType.IMAGE_TO_VIDEO ? 'See the generated video.' : reading.present}
---
${titles.icons[2]} ${titles.future}
${reading.future}
---
Generated by Ok-E-store!
        `.trim();

        const shareData: ShareData = {
            title: `My ${divinationType} ${titles.main}`,
            text: textToShare,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(textToShare);
                alert('Result copied to clipboard!');
            }
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.toLowerCase().includes('cancel')) return;
            console.error('Share failed:', err);
            try {
                await navigator.clipboard.writeText(textToShare);
                alert('Result copied to clipboard!');
            } catch (clipboardErr) {
                console.error('Clipboard failed:', clipboardErr);
                prompt('Copy this link manually:', textToShare);
            }
        }
    };

    return (
        <Card className="animate-fade-in max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
                <button onClick={onReset} className="text-purple-300 hover:text-white transition">&larr; नई भविष्यवाणी</button>
                <button
                    onClick={handleSpeak}
                    disabled={isGeneratingSpeech}
                    className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg border border-white/20 hover:bg-purple-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
                >
                    {isGeneratingSpeech ? (
                         <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    ) : isSpeaking ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h6v4H9z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                        </svg>
                    )}
                </button>
            </div>

            <h2 className="text-3xl font-hindi font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6">
                Your {divinationType} {titles.main}
            </h2>

            {divinationType === DivinationType.LOVE_COMPATIBILITY && reading.compatibilityPercentage !== undefined && (
                <div className="my-6 flex flex-col items-center">
                    <h3 className="text-2xl font-hindi font-bold text-white mb-4">Compatibility</h3>
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle className="text-white/10" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                            <circle
                                className="text-pink-400"
                                strokeWidth="8"
                                strokeDasharray={2 * Math.PI * 42}
                                strokeDashoffset={(2 * Math.PI * 42) * (1 - reading.compatibilityPercentage! / 100)}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="42"
                                cx="50"
                                cy="50"
                                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-white">{reading.compatibilityPercentage}%</span>
                        </div>
                    </div>
                </div>
            )}

            {divinationType === DivinationType.TAROT && reading.cardName && (
                <div className="text-center my-6">
                    <h3 className="text-3xl font-bold font-hindi text-white mb-4">{reading.cardName}</h3>
                    {reading.imageUrl && (
                        <img 
                            src={reading.imageUrl} 
                            alt={`Tarot card for ${reading.cardName}`}
                            className="mx-auto rounded-lg shadow-2xl w-full max-w-xs"
                        />
                    )}
                </div>
            )}
            
            {divinationType !== DivinationType.TAROT && reading.imageUrl && (
                <img src={reading.imageUrl} alt="Generated" className="my-6 mx-auto rounded-lg shadow-2xl w-full max-w-lg"/>
            )}
            
            {(divinationType === DivinationType.STORY_TO_VIDEO || divinationType === DivinationType.IMAGE_TO_VIDEO) && videoBlobUrl && (
                <div className="my-6 mx-auto rounded-lg shadow-2xl w-full max-w-lg bg-black/20 flex items-center justify-center">
                    <video src={videoBlobUrl} controls className="w-full h-full rounded-lg" />
                </div>
            )}

            <ResultSection title={titles.past} content={reading.past} icon={titles.icons[0]} />
            <div className="border-t border-white/20 my-6"></div>
            <ResultSection title={titles.present} content={reading.present} icon={titles.icons[1]} />
            <div className="border-t border-white/20 my-6"></div>
            <ResultSection title={titles.future} content={reading.future} icon={titles.icons[2]} />
            
            <div className="text-center mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                    onClick={onSave}
                    className={`px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
                        isSaved
                            ? 'bg-green-600 text-white shadow-lg cursor-default'
                            : 'bg-white/10 text-purple-200 border border-white/20 hover:bg-white/20'
                    }`}
                    disabled={isSaved}
                >
                    {isSaved ? 'सहेजा गया!' : 'सहेजें'}
                </button>
                <button
                    onClick={handleShare}
                    className="px-6 py-3 bg-white/10 text-purple-200 border border-white/20 rounded-full font-bold text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-white/20"
                >
                    साझा करें
                </button>
            </div>
        </Card>
    );
};

export default ResultDisplay;