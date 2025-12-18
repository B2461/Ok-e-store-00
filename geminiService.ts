import { DivinationType, UserInput, Reading, Place } from '../types';

// AI Service Disabled for Store-Only Mode

export const getApiKey = (): string => {
    return "";
};

export const generatePalmImage = async (): Promise<string> => {
    return "";
};

export const generateSpeech = async (text: string): Promise<string> => {
    return "";
};

export const findLocalExperts = async (query: string): Promise<Place[]> => {
    return [];
};

export const generateHtmlFromUrl = async (prompt: string): Promise<string> => {
    return "<h1>Service Disabled</h1>";
};

export const generateReading = async (type: DivinationType, input: UserInput): Promise<Reading> => {
    // Return a default placeholder response so the app doesn't crash if called
    return {
        past: "Feature Disabled",
        present: "This feature has been removed to focus on the Shopping Store.",
        future: "Please visit our store for products.",
        cardName: "N/A"
    };
};