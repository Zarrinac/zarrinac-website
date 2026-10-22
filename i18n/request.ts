import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { SITE_ID } from '@/lib/siteId';
import { routing } from './routing';

// Resolves locale/messages for each request on the server.
//
// zarrinac.com serves the same sections as hisense-ir.com, so it layers its own copy
// (messages/sites/zarrinac/<locale>.json — route eyebrows, H1 titles, descriptions) over
// the shared dictionaries. The overlay holds only the keys that differ; everything else
// falls through to messages/<locale>.json. Keep both overlay locales key-for-key in sync.

type Messages = Record<string, unknown>;

const isPlainObject = (value: unknown): value is Messages =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const mergeMessages = (base: Messages, overlay: Messages): Messages => {
  const merged: Messages = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    const current = merged[key];
    merged[key] =
      isPlainObject(current) && isPlainObject(value) ? mergeMessages(current, value) : value;
  }
  return merged;
};

export default getRequestConfig(async ({ requestLocale }) => {
  const provided = await requestLocale;
  const locale = hasLocale(routing.locales, provided) ? provided : routing.defaultLocale;
  const messagesModule = (await import(`../messages/${locale}.json`)) as {
    default: Messages;
  };
  const { default: baseMessages } = messagesModule;

  if (SITE_ID !== 'zarrinac') {
    return { locale, messages: baseMessages };
  }

  const overlayModule = (await import(`../messages/sites/zarrinac/${locale}.json`)) as {
    default: Messages;
  };

  return {
    locale,
    messages: mergeMessages(baseMessages, overlayModule.default),
  };
});
