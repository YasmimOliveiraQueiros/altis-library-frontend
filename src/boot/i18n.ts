import { defineBoot } from '#q-app';
import { createI18n } from 'vue-i18n';

import messages from '@/i18n';

export type MessageLanguages = keyof typeof messages;
const DEFAULT_LOCALE: MessageLanguages = 'pt-BR';
const LOCALE_STORAGE_KEY = 'locale';

function getInitialLocale(): MessageLanguages {
  if (typeof localStorage === 'undefined') return DEFAULT_LOCALE;

  const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
  return savedLocale && Object.prototype.hasOwnProperty.call(messages, savedLocale)
    ? (savedLocale as MessageLanguages)
    : DEFAULT_LOCALE;
}
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = (typeof messages)['en-US'];

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

export default defineBoot(({ app }) => {
  const i18n = createI18n<{ message: MessageSchema }, MessageLanguages>({
    locale: getInitialLocale(),
    legacy: false,
    messages,
  });

  // Set i18n instance on app
  app.use(i18n);
});
