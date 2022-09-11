/**
 * @type {{isPublic: boolean, message: {features: string[], bugfixes: string[], ad: string | null, footer: string | null, announce: string | null}}}
 */
module.exports = {
  isPublic: false,
  message: {
    ad: 'В случае нахождения недостатков или предложений используйте команду /issue. Чем подробнее Вы опишите свою заявку, тем быстрее она будет рассмотрена',
    announce: 'У бота в связи с переездом сменился сайт. https://discord-bot-deus-web.onrender.com/',
    features: [
      'Переделана система получения версии веб-приложения',
    ],
    bugfixes: [],
    footer: null,
  },
};
