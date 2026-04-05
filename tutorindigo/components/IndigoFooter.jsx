const FOOTER_BG = "#76a5a8";

const FOOTER_COLUMNS = [
  {
    titleMessageKey: "footer.column.links",
    links: [
      { messageKey: "footer.links.news", href: "/pages/news/" },
      { messageKey: "footer.links.privacyStatement", href: "/privacy" },
      { messageKey: "footer.links.termsOfUse", href: "/tos" },
      { messageKey: "footer.links.faq", href: "/faq" },
      { messageKey: "footer.links.youtube", href: "https://www.youtube.com/@finishingx_EN" },
    ],
  },
  {
    titleMessageKey: "footer.column.contactUs",
    links: [
      { messageKey: "footer.contact.email", href: "mailto:info@finishingx.de" },
      { messageKey: "footer.contact.schedulePhoneCall", href: "/pages/schedule-meeting/" },
      { messageKey: "footer.contact.aboutUs", href: "/about" },
    ],
  },
  {
    titleMessageKey: "footer.column.shop",
    links: [
      { messageKey: "footer.shop.tryFree", href: "/register" },
      { messageKey: "footer.shop.pricing", href: "/pages/pricing-table/" },
      { messageKey: "footer.shop.subscribe", href: "/pages/subscribe/" },
      { messageKey: "footer.shop.cancelMembership", href: "/pages/cancel_membership_form/" },
      { messageKey: "footer.shop.revocation", href: "/pages/withdrawal_form/" },
      { messageKey: "footer.shop.webinars", href: "/pages/webinar/" },
      { messageKey: "footer.shop.consulting", href: "/pages/Arbeitsschutzberatung/" },
    ],
  },
];

const resolveFooterHref = (href, lmsBase) => {
  if (!href) {
    return "#";
  }
  if (/^(https?:|mailto:|tel:)/i.test(href)) {
    return href;
  }
  const path = href.startsWith("/") ? href : `/${href}`;
  const base = (lmsBase || "").replace(/\/$/, "");
  return `${base}${path}`;
};

const IndigoFooter = () => {
  const intl = useIntl();
  const config = getConfig();
  const lmsBase = config.LMS_BASE_URL || "";
  const year = new Date().getFullYear();

  const messages = {
    "footer.column.links": {
      id: "footer.column.links",
      defaultMessage: "Links",
      description: "Footer column heading for general links",
    },
    "footer.column.contactUs": {
      id: "footer.column.contactUs",
      defaultMessage: "Contact us",
      description: "Footer column heading for contact information",
    },
    "footer.column.shop": {
      id: "footer.column.shop",
      defaultMessage: "Shop",
      description: "Footer column heading for shop-related links",
    },
    "footer.links.news": {
      id: "footer.links.news",
      defaultMessage: "News",
      description: "Footer link: news",
    },
    "footer.links.privacyStatement": {
      id: "footer.links.privacyStatement",
      defaultMessage: "Privacy statement",
      description: "Footer link: privacy statement",
    },
    "footer.links.termsOfUse": {
      id: "footer.links.termsOfUse",
      defaultMessage: "Terms of use",
      description: "Footer link: terms of use",
    },
    "footer.links.faq": {
      id: "footer.links.faq",
      defaultMessage: "FAQ",
      description: "Footer link: FAQ",
    },
    "footer.links.youtube": {
      id: "footer.links.youtube",
      defaultMessage: "YouTube",
      description: "Footer link: YouTube channel",
    },
    "footer.contact.email": {
      id: "footer.contact.email",
      defaultMessage: "info@finishingx.de",
      description: "Footer contact email (link label and mailto)",
    },
    "footer.contact.schedulePhoneCall": {
      id: "footer.contact.schedulePhoneCall",
      defaultMessage: "Schedule phone call",
      description: "Footer link: schedule a phone call",
    },
    "footer.contact.aboutUs": {
      id: "footer.contact.aboutUs",
      defaultMessage: "About us",
      description: "Footer link: about us",
    },
    "footer.shop.tryFree": {
      id: "footer.shop.tryFree",
      defaultMessage: "Try it for free",
      description: "Footer shop link: free trial",
    },
    "footer.shop.pricing": {
      id: "footer.shop.pricing",
      defaultMessage: "Pricing",
      description: "Footer shop link: pricing",
    },
    "footer.shop.subscribe": {
      id: "footer.shop.subscribe",
      defaultMessage: "Subscribe",
      description: "Footer shop link: subscribe",
    },
    "footer.shop.cancelMembership": {
      id: "footer.shop.cancelMembership",
      defaultMessage: "Cancel membership",
      description: "Footer shop link: cancel membership",
    },
    "footer.shop.revocation": {
      id: "footer.shop.revocation",
      defaultMessage: "Revocation",
      description: "Footer shop link: revocation / withdrawal policy",
    },
    "footer.shop.webinars": {
      id: "footer.shop.webinars",
      defaultMessage: "Webinars",
      description: "Footer shop link: webinars",
    },
    "footer.shop.consulting": {
      id: "footer.shop.consulting",
      defaultMessage: "Consulting",
      description: "Footer shop link: consulting",
    },
    "footer.cert.zfu.alt": {
      id: "footer.cert.zfu.alt",
      defaultMessage:
        "ZFU seal — Staatliche Zentralstelle für Fernunterricht",
      description: "Alt text for ZFU certification logo in footer",
    },
    "footer.cert.iso.alt": {
      id: "footer.cert.iso.alt",
      defaultMessage: "ISO 9001:2015 certification",
      description: "Alt text for ISO 9001 logo in footer",
    },
    "footer.copyright.finishingx": {
      id: "footer.copyright.finishingx",
      defaultMessage: "© {year} FinishingX. All rights reserved.",
      description: "Footer copyright line for FinishingX",
    },
  };

  const footerCss = `
    .indigo-finishingx-footer {
      --indigo-footer-bg: ${FOOTER_BG};
      --indigo-footer-fg: #ffffff;
      background-color: var(--indigo-footer-bg);
      color: var(--indigo-footer-fg);
      font-family: inherit;
      padding: 2.75rem 1.5rem 2.25rem;
      box-sizing: border-box;
    }
    .indigo-finishingx-footer *,
    .indigo-finishingx-footer *::before,
    .indigo-finishingx-footer *::after {
      box-sizing: border-box;
    }
    .indigo-finishingx-footer a {
      color: var(--indigo-footer-fg);
      text-decoration: none;
    }
    .indigo-finishingx-footer a:hover,
    .indigo-finishingx-footer a:focus {
      text-decoration: underline;
    }
    .indigo-finishingx-footer__inner {
      max-width: 1200px;
      margin: 0 auto;
    }
    .indigo-finishingx-footer__columns {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 2.5rem 3rem;
      align-items: start;
      justify-items: start;
      margin-bottom: 2.75rem;
    }
    @media (max-width: 768px) {
      .indigo-finishingx-footer__columns {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
    .indigo-finishingx-footer__column {
      min-width: 0;
      width: 100%;
      max-width: 22rem;
    }
    .indigo-finishingx-footer__column-title {
      margin: 0 0 1rem;
      padding-top: 0.65rem;
      border-top: 1px solid rgba(255, 255, 255, 0.9);
      width: fit-content;
      max-width: 100%;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      line-height: 1.3;
      color: #ffffff;
    }
    .indigo-finishingx-footer__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      font-size: 0.9375rem;
      font-weight: 400;
      line-height: 1.45;
    }
    .indigo-finishingx-footer__list li a:hover,
    .indigo-finishingx-footer__list li a:focus {
      color: #1e5376;
      text-decoration: none;
    }
    .indigo-finishingx-footer__bottom {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1.25rem;
      padding-top: 0.25rem;
    }
    .indigo-finishingx-footer__certs {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.5rem;
    }
    .indigo-finishingx-footer__cert-img {
      display: block;
      height: 3.25rem;
      width: auto;
      max-width: 140px;
      object-fit: contain;
    }
    .indigo-finishingx-footer__copyright {
      margin: 0;
      font-size: 0.875rem;
      opacity: 0.95;
    }
  `;

  return (
    <>
      <style>{footerCss}</style>
      <div className="wrapper wrapper-footer indigo-finishingx-footer">
        <footer id="footer" className="tutor-container indigo-finishingx-footer__inner">
          <div className="indigo-finishingx-footer__columns">
            {FOOTER_COLUMNS.map((column) => (
              <div
                key={column.titleMessageKey}
                className="indigo-finishingx-footer__column"
              >
                <h2 className="indigo-finishingx-footer__column-title">
                  {intl.formatMessage(messages[column.titleMessageKey])}
                </h2>
                <ul className="indigo-finishingx-footer__list">
                  {column.links.map((link) => (
                    <li key={link.messageKey}>
                      <a
                        href={resolveFooterHref(link.href, lmsBase)}
                        rel={
                          /^https?:/i.test(link.href)
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {intl.formatMessage(messages[link.messageKey])}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="indigo-finishingx-footer__bottom">
            <div className="indigo-finishingx-footer__certs">
              <img
                className="indigo-finishingx-footer__cert-img"
                src={`${lmsBase}/static/indigo/images/footer-cert-zfu.png`}
                alt={intl.formatMessage(messages["footer.cert.zfu.alt"])}
                loading="lazy"
              />
              <img
                className="indigo-finishingx-footer__cert-img"
                src={`${lmsBase}/static/indigo/images/footer-cert-iso9001.png`}
                alt={intl.formatMessage(messages["footer.cert.iso.alt"])}
                loading="lazy"
              />
            </div>
            <p className="indigo-finishingx-footer__copyright">
              {intl.formatMessage(messages["footer.copyright.finishingx"], {
                year,
              })}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};
