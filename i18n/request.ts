import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Resolves locale/messages for each request on the server.

export default getRequestConfig(async ({ requestLocale }) => {
  const provided = await requestLocale;
  const locale = hasLocale(routing.locales, provided) ? provided : routing.defaultLocale;
  const messagesModule = (await import(`../messages/${locale}.json`)) as {
    default: Record<string, unknown>;
  };
  const { default: messages } = messagesModule;

  return {
    locale,
    messages,
  };
});
