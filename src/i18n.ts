// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Import your translation files
import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';
import translationBG from './locales/bg/translation.json';

i18n
		.use(initReactI18next)
		.init({
					resources: {
								en: { translation: translationEN },
								de: { translation: translationDE },
								bg: { translation: translationBG },
					},
					lng: 'en', // default language
					fallbackLng: 'en',
					interpolation: {
								escapeValue: false,
					},
		});

export default i18n;