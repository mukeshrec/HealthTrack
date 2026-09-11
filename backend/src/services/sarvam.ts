import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const SARVAM_URL = 'https://api.sarvam.ai/translate';

export const translateText = async (text: string, targetLanguageCode: string): Promise<string> => {
  if (!text) return '';
  if (!SARVAM_API_KEY) {
    console.warn('SARVAM_API_KEY is not defined. Returning original text.');
    return text;
  }

  // If target is English, no need to translate (assuming source is English)
  if (targetLanguageCode === 'en-IN' || targetLanguageCode === 'en') {
    return text;
  }

  try {
    const response = await axios.post(
      SARVAM_URL,
      {
        input: text,
        source_language_code: 'en-IN',
        target_language_code: targetLanguageCode,
        speaker_gender: 'Male',
        mode: 'formal',
        model: 'sarvam-translate:v1',
        enable_preprocessing: true
      },
      {
        headers: {
          'api-subscription-key': SARVAM_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    // Sarvam API returns { translated_text: string }
    if (response.data && response.data.translated_text) {
      return response.data.translated_text;
    }
    
    return text;
  } catch (error: any) {
    console.error('Sarvam AI Translation Error:', error.response?.data || error.message);
    return text; // Fallback to original text on error
  }
};
