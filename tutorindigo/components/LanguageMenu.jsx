
/**
 * Header language switcher (rendered inside CustomHeader.jsx). Sets the same
 * LANGUAGE_PREFERENCE_COOKIE_NAME cookie ('openedx-language-preference' by
 * default) that both frontend-platform's i18n (getLocale(), see
 * @edx/frontend-platform/i18n/lib.js) and edx-platform's own
 * LocaleMiddleware/DarkLangMiddleware read — the same mechanism the stock
 * LMS footer language selector uses (openedx.core.djangoapps.lang_pref),
 * just surfaced in the MFE header too. Reload picks up the new locale on
 * both the current MFE and, since the cookie is shared, any Django-rendered
 * page (marketing site, Studio) the user navigates to afterwards.
 *
 * Options come from INDIGO_SUPPORTED_LANGUAGES (MFE_CONFIG, set in
 * plugin.py) — override via:
 *   tutor config save --set 'INDIGO_SUPPORTED_LANGUAGES=[{"value": "en", "label": "English"}]'
 */

/** Module scope, not recreated every render — see HeaderTranslations.jsx for
 * why this id's German string lives there instead of a locale JSON file. */
const LANGUAGE_MENU_MESSAGES = {
  'header.language.label': {
    id: 'header.language.label',
    defaultMessage: 'Language',
    description: 'Header language selector label',
  },
};

const LanguageMenu = () => {
  const intl = useIntl();
  const config = getConfig();
  const languages = config.INDIGO_SUPPORTED_LANGUAGES || [];
  const isEnabled = config.INDIGO_ENABLE_LANGUAGE_MENU !== false;

  // Nothing to switch between with 0 or 1 language configured.
  if (!isEnabled || languages.length < 2) {
    return null;
  }

  const cookieName = config.LANGUAGE_PREFERENCE_COOKIE_NAME || 'openedx-language-preference';
  const serverURL = new URL(config.LMS_BASE_URL);
  const currentLocale = (intl.locale || 'en').toLowerCase();
  const selectedValue = languages.find((lang) => lang.value.toLowerCase() === currentLocale)?.value
    || languages.find((lang) => currentLocale.startsWith(lang.value.toLowerCase()))?.value
    || languages[0].value;

  const onChange = (event) => {
    const cookies = new Cookies();
    cookies.set(cookieName, event.target.value, {
      path: '/',
      domain: serverURL.hostname,
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      sameSite: 'lax',
    });
    window.location.reload();
  };

  return (
    <div className="indigo-language-menu">
      <label htmlFor="indigo-header-language-select" className="sr-only">
        {intl.formatMessage(LANGUAGE_MENU_MESSAGES['header.language.label'])}
      </label>
      <select
        id="indigo-header-language-select"
        className="indigo-language-menu__select"
        value={selectedValue}
        onChange={onChange}
        aria-label={intl.formatMessage(LANGUAGE_MENU_MESSAGES['header.language.label'])}
      >
        {languages.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};
