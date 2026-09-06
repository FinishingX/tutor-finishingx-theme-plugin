
/**
 * FinishingX marketing header — replaces the native <Header /> / <LearningHeader />
 * on every Indigo-styled MFE (see HEADER_REPLACEMENT_SLOTS in plugin.py).
 *
 * Ported from the TitanEd/tels tutor-indigo fork's CustomHeader, adapted because:
 *  - FinishingX has no "public" marketing MFE — marketing pages (home/courses/
 *    about/contact) are Mako templates served by ulmo-theme on the LMS domain
 *    itself, so links resolve against LMS_BASE_URL instead of a "/public" MFE
 *    mount (compare IndigoFooter.jsx's resolveFooterHref, same idea).
 *  - No Control Hub app in this deployment — dropped from the user menu.
 *  - Self-contained <style> (no dependency on a brand package shipping
 *    .custom-header/.tels-* classes), matching this repo's existing
 *    IndigoFooter.jsx / ThemedLogo.jsx / MobileViewHeader.jsx convention.
 *  - Primary nav is intentionally just About Us / Contact Us / FAQ (see
 *    NAV_KEYS) — Home is the logo, Dashboard lives in the user menu.
 *  - <LanguageMenu /> (LanguageMenu.jsx) renders a language <select> here
 *    when 2+ languages are configured (INDIGO_SUPPORTED_LANGUAGES).
 *
 * Slot widget ids used (see plugin.py _custom_header_plugins()):
 *   custom_header_desktop / custom_header_mobile — native <Header /> MFEs
 *   custom_header_learning                       — <LearningHeader /> MFEs
 */

const CUSTOM_HEADER_CSS = `
  .indigo-custom-header {
    --indigo-header-bg: #ffffff;
    --indigo-header-fg: #1b1b1b;
    --indigo-header-accent: #6EACAF;
    --indigo-header-border: #e5e5e5;
    background-color: var(--indigo-header-bg);
    color: var(--indigo-header-fg);
    border-bottom: 1px solid var(--indigo-header-border);
    box-sizing: border-box;
  }
  [data-paragon-theme-variant="dark"] .indigo-custom-header {
    --indigo-header-bg: #0D0D0E;
    --indigo-header-fg: #f2f2f2;
    --indigo-header-border: rgba(255, 255, 255, 0.15);
  }
  .indigo-custom-header *,
  .indigo-custom-header *::before,
  .indigo-custom-header *::after {
    box-sizing: border-box;
  }
  .indigo-custom-header a {
    color: inherit;
    text-decoration: none;
  }
  .indigo-custom-header__row {
    max-width: 1600px;
    margin: 0 auto;
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  .indigo-custom-header__logo img {
    display: block;
    height: 2.25rem;
    width: auto;
  }
  .indigo-custom-header__logo .logo-white { display: none; }
  [data-paragon-theme-variant="dark"] .indigo-custom-header__logo .logo-default { display: none; }
  [data-paragon-theme-variant="dark"] .indigo-custom-header__logo .logo-white { display: block; }
  .indigo-custom-header__nav {
    flex: 1 1 auto;
    display: flex;
    gap: 1.5rem;
  }
  .indigo-custom-header__nav-link {
    font-size: 0.9375rem;
    font-weight: 500;
    padding: 0.25rem 0;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
  }
  .indigo-custom-header__nav-link:hover,
  .indigo-custom-header__nav-link:focus,
  .indigo-custom-header__nav-link.active {
    border-bottom-color: var(--indigo-header-accent);
  }
  .indigo-custom-header__actions {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .indigo-custom-header__btn {
    display: inline-block;
    padding: 0.4rem 1rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    white-space: nowrap;
  }
  .indigo-custom-header__btn--ghost {
    border: 1px solid var(--indigo-header-accent);
    color: var(--indigo-header-accent);
  }
  .indigo-custom-header__btn--primary {
    background-color: var(--indigo-header-accent);
    color: #ffffff;
  }
  .indigo-language-menu__select {
    background-color: transparent;
    color: inherit;
    border: 1px solid var(--indigo-header-border);
    border-radius: 0.25rem;
    padding: 0.3rem 0.5rem;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
  }
  [data-paragon-theme-variant="dark"] .indigo-language-menu__select option {
    color: #1b1b1b;
  }
  .indigo-custom-header__mobile-panel .indigo-language-menu {
    padding: 0.5rem 0;
  }
  .indigo-custom-header__user {
    position: relative;
  }
  .indigo-custom-header__user-toggle {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    padding: 0.25rem 0;
  }
  .indigo-custom-header__user-menu {
    position: absolute;
    right: 0;
    top: calc(100% + 0.5rem);
    background-color: var(--indigo-header-bg);
    border: 1px solid var(--indigo-header-border);
    border-radius: 0.25rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    list-style: none;
    margin: 0;
    padding: 0.5rem 0;
    min-width: 12rem;
    z-index: 1030;
  }
  .indigo-custom-header__user-menu li a {
    display: block;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    white-space: nowrap;
  }
  .indigo-custom-header__user-menu li a:hover,
  .indigo-custom-header__user-menu li a:focus {
    background-color: rgba(110, 172, 175, 0.12);
  }
  .indigo-custom-header__mobile-toggle {
    display: none;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0.25rem;
  }
  .indigo-custom-header__mobile-panel {
    display: none;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem 1.5rem 1rem;
    border-top: 1px solid var(--indigo-header-border);
  }
  .indigo-custom-header__mobile-panel a {
    padding: 0.5rem 0;
    font-size: 0.9375rem;
    font-weight: 500;
  }
  @media (max-width: 768px) {
    .indigo-custom-header__nav,
    .indigo-custom-header__actions {
      display: none;
    }
    .indigo-custom-header__mobile-toggle {
      display: inline-flex;
      margin-left: auto;
    }
    .indigo-custom-header__mobile-panel.open {
      display: flex;
    }
  }
`;

/** Marketing routes served by ulmo-theme Mako templates on the LMS domain
 * (static_template_view — same routes IndigoFooter.jsx already links to). */
const NAV_ROUTE_BY_KEY = {
  about: '/about',
  contact: '/contact',
  faq: '/faq',
};

/** Primary nav — About Us / Contact Us / FAQ only, for both guest and
 * authenticated users. Home is still reachable via the logo, and Dashboard
 * via the authenticated user menu below. */
const NAV_KEYS = ['about', 'contact', 'faq'];

/** Resolve a marketing/app path against LMS_BASE_URL — same rule as
 * IndigoFooter.jsx's resolveFooterHref, kept local so this file stays
 * self-contained like the rest of tutorindigo/components. */
const resolveHref = (path, lmsBase) => {
  if (/^https?:/i.test(path)) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${(lmsBase || '').replace(/\/$/, '')}${normalized}`;
};

/** Message descriptors — module scope (not recreated on every render, and
 * the conventional react-intl shape even though nothing here actually gets
 * i18n_extract'd from this file — see HeaderTranslations.jsx for why, and for
 * the German strings these ids resolve to). */
const HEADER_MESSAGES = {
  'header.logo.aria': {
    id: 'header.logo.aria',
    defaultMessage: '{siteName} Home',
    description: 'Aria label for the header logo home link',
  },
  'header.nav.aria': {
    id: 'header.nav.aria',
    defaultMessage: 'Primary',
    description: 'Aria label for primary navigation',
  },
  'header.nav.dashboard': {
    id: 'header.nav.dashboard',
    defaultMessage: 'Dashboard',
    description: 'User menu Dashboard link',
  },
  'header.nav.about': {
    id: 'header.nav.about',
    defaultMessage: 'About Us',
    description: 'Header About Us link',
  },
  'header.nav.contact': {
    id: 'header.nav.contact',
    defaultMessage: 'Contact Us',
    description: 'Header Contact Us link',
  },
  'header.nav.faq': {
    id: 'header.nav.faq',
    defaultMessage: 'FAQ',
    description: 'Header FAQ link',
  },
  'header.actions.signIn': {
    id: 'header.actions.signIn',
    defaultMessage: 'Sign In',
    description: 'Header Sign In button',
  },
  'header.actions.register': {
    id: 'header.actions.register',
    defaultMessage: 'Register',
    description: 'Header Register button',
  },
  'header.mobile.menu': {
    id: 'header.mobile.menu',
    defaultMessage: 'Menu',
    description: 'Mobile menu toggle aria label',
  },
  'header.user.menu': {
    id: 'header.user.menu',
    defaultMessage: 'User menu',
    description: 'Authenticated user menu toggle aria label',
  },
  'header.user.profile': {
    id: 'header.user.profile',
    defaultMessage: 'Profile',
    description: 'User dropdown Profile link',
  },
  'header.user.account': {
    id: 'header.user.account',
    defaultMessage: 'Account',
    description: 'User dropdown Account settings link',
  },
  'header.user.studio': {
    id: 'header.user.studio',
    defaultMessage: 'Studio',
    description: 'Studio link label in the user menu (course staff only)',
  },
  'header.user.logout': {
    id: 'header.user.logout',
    defaultMessage: 'Sign Out',
    description: 'User dropdown Sign Out link',
  },
};

const CustomHeader = () => {
  const intl = useIntl();
  const config = getConfig();
  const { authenticatedUser } = useContext(AppContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const lmsBase = config.LMS_BASE_URL || '';
  const siteName = config.SITE_NAME || 'FinishingX';
  const logoUrl = `${lmsBase}/static/indigo/images/logo.png`;
  const logoWhiteUrl = `${lmsBase}/static/indigo/images/logo-white.png`;
  const dashboardUrl = `${lmsBase}/dashboard`;
  const loginUrl = config.LOGIN_URL;
  const registerUrl = config.REGISTER_URL || `${lmsBase}/register`;
  const logoutUrl = config.LOGOUT_URL;
  const profileUrl = authenticatedUser && config.ACCOUNT_PROFILE_URL
    ? `${config.ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`
    : null;
  const accountUrl = config.ACCOUNT_SETTINGS_URL;
  const studioUrl = config.STUDIO_BASE_URL;
  const isCourseStaff = authenticatedUser?.administrator === true;

  const userMenuLinks = authenticatedUser ? [
    profileUrl && {
      key: 'profile',
      href: profileUrl,
      messageKey: 'header.user.profile',
    },
    accountUrl && {
      key: 'account',
      href: accountUrl,
      messageKey: 'header.user.account',
    },
    {
      key: 'dashboard',
      href: dashboardUrl,
      messageKey: 'header.nav.dashboard',
    },
    isCourseStaff && studioUrl && {
      key: 'studio',
      href: studioUrl,
      messageKey: 'header.user.studio',
    },
    {
      key: 'logout',
      href: logoutUrl,
      messageKey: 'header.user.logout',
    },
  ].filter(Boolean) : [];

  useEffect(() => {
    const onDocClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const hrefForKey = (navKey) => resolveHref(NAV_ROUTE_BY_KEY[navKey], lmsBase);

  const renderNavLink = (navKey, { onClick, keyPrefix = '' } = {}) => (
    <a
      key={`${keyPrefix}${navKey}`}
      href={hrefForKey(navKey)}
      className="indigo-custom-header__nav-link"
      onClick={onClick}
    >
      {intl.formatMessage(HEADER_MESSAGES[`header.nav.${navKey}`])}
    </a>
  );

  const closeMobile = () => setMobileOpen(false);
  const closeUserMenu = () => setUserMenuOpen(false);

  return (
    <>
      <style>{CUSTOM_HEADER_CSS}</style>
      <header className="indigo-custom-header">
        <div className="indigo-custom-header__row">
          <a
            href={resolveHref('/', lmsBase)}
            className="indigo-custom-header__logo"
            aria-label={intl.formatMessage(HEADER_MESSAGES['header.logo.aria'], { siteName })}
          >
            <img className="logo-default" src={logoUrl} alt={siteName} />
            <img className="logo-white" src={logoWhiteUrl} alt={siteName} />
          </a>

          <nav
            className="indigo-custom-header__nav"
            aria-label={intl.formatMessage(HEADER_MESSAGES['header.nav.aria'])}
          >
            {NAV_KEYS.map((navKey) => renderNavLink(navKey))}
          </nav>

          <div className="indigo-custom-header__actions">
            <LanguageMenu />
            {authenticatedUser ? (
              <div className="indigo-custom-header__user" ref={userMenuRef}>
                <button
                  type="button"
                  className="indigo-custom-header__user-toggle"
                  aria-label={intl.formatMessage(HEADER_MESSAGES['header.user.menu'])}
                  aria-expanded={userMenuOpen}
                  onClick={() => setUserMenuOpen((open) => !open)}
                >
                  {authenticatedUser.name || authenticatedUser.username}
                  <Icon src={ExpandMore} />
                </button>
                {userMenuOpen && (
                  <ul className="indigo-custom-header__user-menu">
                    {userMenuLinks.map((item) => (
                      <li key={item.key}>
                        <a href={item.href} onClick={closeUserMenu}>
                          {intl.formatMessage(HEADER_MESSAGES[item.messageKey])}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <>
                <a href={loginUrl} className="indigo-custom-header__btn indigo-custom-header__btn--ghost">
                  {intl.formatMessage(HEADER_MESSAGES['header.actions.signIn'])}
                </a>
                <a href={registerUrl} className="indigo-custom-header__btn indigo-custom-header__btn--primary">
                  {intl.formatMessage(HEADER_MESSAGES['header.actions.register'])}
                </a>
              </>
            )}
          </div>

          <button
            type="button"
            className="indigo-custom-header__mobile-toggle"
            aria-label={intl.formatMessage(HEADER_MESSAGES['header.mobile.menu'])}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <Icon src={mobileOpen ? Close : MenuIcon} />
          </button>
        </div>

        <div className={`indigo-custom-header__mobile-panel${mobileOpen ? ' open' : ''}`}>
          {NAV_KEYS.map((navKey) => renderNavLink(navKey, { onClick: closeMobile, keyPrefix: 'mobile-' }))}
          <LanguageMenu />
          {authenticatedUser ? (
            userMenuLinks.map((item) => (
              <a key={`mobile-${item.key}`} href={item.href} onClick={closeMobile}>
                {intl.formatMessage(HEADER_MESSAGES[item.messageKey])}
              </a>
            ))
          ) : (
            <>
              <a
                href={loginUrl}
                className="indigo-custom-header__btn indigo-custom-header__btn--ghost"
                onClick={closeMobile}
              >
                {intl.formatMessage(HEADER_MESSAGES['header.actions.signIn'])}
              </a>
              <a
                href={registerUrl}
                className="indigo-custom-header__btn indigo-custom-header__btn--primary"
                onClick={closeMobile}
              >
                {intl.formatMessage(HEADER_MESSAGES['header.actions.register'])}
              </a>
            </>
          )}
        </div>
      </header>
    </>
  );
};
