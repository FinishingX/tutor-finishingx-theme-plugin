
/**
 * Translations for the strings CustomHeader.jsx / LanguageMenu.jsx render.
 *
 * Why this can't just go through openedx-translations like everything else:
 * this file — like the rest of tutorindigo/components — ships from the
 * *Tutor plugin*, not from any MFE's own `src/` tree. `formatjs extract`
 * (`npm run i18n_extract`) only ever scans an MFE's own source, so these
 * message ids never get extracted into `src/i18n/messages/*.json`, and Atlas
 * has nothing to pull for them from openedx-translations no matter how
 * correctly translations are configured there for a given MFE — that pipeline
 * is scoped to each MFE's own repo. The ids/English defaultMessage text live
 * inline in CustomHeader.jsx/LanguageMenu.jsx (`intl.formatMessage(messages[key])`);
 * this file supplies everything else that pipeline can't reach, and merges it
 * into frontend-platform's live message registry via the same public
 * mergeMessages() API an installed plugin bundle would use for its own
 * strings, so React still renders these through the normal formatMessage()
 * path — no separate lookup mechanism.
 *
 * English needs no entry here — every message's own `defaultMessage` in
 * CustomHeader.jsx/LanguageMenu.jsx already covers it, and duplicating that
 * text here would just be a second copy that could quietly drift out of sync.
 *
 * Only merge after i18n has actually been configured. `@edx/frontend-platform`
 * calls jsFileConfig() — which runs this whole env.config.jsx module — before
 * configureI18n() (see initialize.js's init sequence), so at the time this
 * file's top-level code runs, frontend-platform/i18n's internal `messages` is
 * still `null`; merging into it here would merge into `null` instead of the
 * real catalog. APP_I18N_INITIALIZED fires right after configureI18n()
 * completes and well before the app actually mounts, so subscribing to it
 * guarantees the merge lands before first paint without racing configure().
 *
 * Add another supported language by adding another top-level key here (its
 * locale code — see LanguageMenu.jsx / INDIGO_SUPPORTED_LANGUAGES in
 * plugin.py) with the same id set.
 */
const HEADER_TRANSLATIONS = {
  de: {
    'header.logo.aria': '{siteName} Startseite',
    'header.nav.aria': 'Hauptnavigation',
    'header.nav.dashboard': 'Meine Kurse',
    'header.nav.about': 'Über uns',
    'header.nav.contact': 'Kontakt',
    'header.nav.faq': 'FAQ',
    'header.actions.signIn': 'Anmelden',
    'header.actions.register': 'Registrieren',
    'header.mobile.menu': 'Menü',
    'header.user.menu': 'Benutzermenü',
    'header.user.profile': 'Profil',
    'header.user.account': 'Konto',
    'header.user.studio': 'Studio',
    'header.user.logout': 'Abmelden',
    'header.language.label': 'Sprache',
  },
};

subscribe(APP_I18N_INITIALIZED, () => {
  mergeMessages(HEADER_TRANSLATIONS);
});
