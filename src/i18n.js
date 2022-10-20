import i18next from 'i18next';
import languageDetector from 'i18next-browser-languagedetector';
import backend from 'i18next-http-backend';
import {initReactI18next} from 'react-i18next';

i18next
  .use(backend)
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `http${process.env.REACT_APP_PROFILE === 'DEV'
        ? ''
        : 's'}://${process.env.REACT_APP_SERVER_URI}/api/locales/{{lng}}/{{ns}}`,
      addPath: `http${process.env.REACT_APP_PROFILE === 'DEV'
        ? ''
        : 's'}://${process.env.REACT_APP_SERVER_URI}/api/locales/add/{{lng}}/{{ns}}`,
    },
    debug: process.env.REACT_APP_LOGGING === 'DEBUG',
    defaultNS: 'web',
    fallbackLng: ['ru'],
    interpolation: {
      escapeValue: false,
    },
    load: 'currentOnly',
    ns: ['web'],
    saveMissing: true,
    supportedLngs: ['en', 'ru'],
  });
