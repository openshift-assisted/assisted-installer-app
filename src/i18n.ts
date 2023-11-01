import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '@openshift-assisted/locales/en/translation.json';

void i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      translation: enTranslation,
    },
  },
  fallbackLng: 'en',
  react: {
    useSuspense: true,
    transSupportBasicHtmlNodes: true, // allow <br/> and simple html elements in translations
  },
});
