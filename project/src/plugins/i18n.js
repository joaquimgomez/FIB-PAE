/*
* https://www.freecodecamp.org/news/how-to-add-internationalization-to-a-vue-application-d9cfdcabb03b/
*/

import Vue from 'vue'; 
import VueI18n from 'vue-i18n';
import es from '@/assets/translations/es.json'; 
import en from '@/assets/translations/en.json'; 
import de from '@/assets/translations/de.json'; 
import ca from '@/assets/translations/ca.json'; 
Vue.use(VueI18n);

const messages = { 
    'es': es, 
    'en': en,
    'de': de,
    'ca': ca
};

const i18n = new VueI18n({ 
    locale: 'es', 
    fallbackLocale: 'en', 
    messages
});

export default i18n;