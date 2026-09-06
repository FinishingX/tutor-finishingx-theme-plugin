from __future__ import annotations

import itertools
import json
import os
import typing as t
from glob import glob

import importlib_resources
from tutor import hooks
from tutor.__about__ import __version_suffix__
from tutormfe.hooks import MFE_APPS, MFE_ATTRS_TYPE, PLUGIN_SLOTS

from .__about__ import __version__

# Handle version suffix in main mode, just like tutor core
if __version_suffix__:
    __version__ += "-" + __version_suffix__


################# Configuration
config: t.Dict[str, t.Dict[str, t.Any]] = {
    # Add here your new settings
    "defaults": {
        "VERSION": __version__,
        "WELCOME_MESSAGE": "The place for all your online learning",
        "PRIMARY_COLOR": "#6EACAF",
        "ENABLE_DARK_TOGGLE": False,
        "ENABLE_LANGUAGE_MENU": True,
        # Languages shown in the header language dropdown (CustomHeader /
        # LanguageMenu). "value" is set verbatim into the
        # LANGUAGE_PREFERENCE_COOKIE_NAME cookie, which both the MFEs
        # (frontend-platform i18n) and edx-platform's LocaleMiddleware read.
        # de-de matches this platform's LANGUAGE_CODE (see edx-platform's
        # CLAUDE.md) so it round-trips through Django with no extra config;
        # showing German MFE strings additionally requires German message
        # catalogs to actually be pulled into the MFE images (Atlas/Transifex
        # at image-build time) — a separate, already-flagged translations
        # pipeline concern, not something this menu can fix on its own.
        "SUPPORTED_LANGUAGES": [
            {"value": "en", "label": "English"},
            {"value": "de-de", "label": "Deutsch"},
        ],
        # Footer links are dictionaries with a "title" and "url"
        # To remove all links, run:
        # tutor config save --set INDIGO_FOOTER_NAV_LINKS=[]
        "FOOTER_NAV_LINKS": [
            {"title": "About Us", "url": "/about"},
            {"title": "Blog", "url": "/blog"},
            {"title": "Donate", "url": "/donate"},
            {"title": "Terms of Service", "url": "/tos"},
            {"title": "Privacy Policy", "url": "/privacy"},
            {"title": "Help", "url": "/help"},
            {"title": "Contact Us", "url": "/contact"},
        ],
    },
    "unique": {},
    "overrides": {},
}

# Theme templates
hooks.Filters.ENV_TEMPLATE_ROOTS.add_item(
    str(importlib_resources.files("tutorindigo") / "templates")
)
# This is where the theme is rendered in the openedx build directory
hooks.Filters.ENV_TEMPLATE_TARGETS.add_items(
    [
        ("indigo", "build/openedx/themes"),
        ("indigo/env.config.jsx", "plugins/mfe/build/mfe"),
    ],
)

# Force the rendering of scss files, even though they are included in a
# "partials" directory
hooks.Filters.ENV_PATTERNS_INCLUDE.add_items(
    [
        r"indigo/lms/static/sass/partials/lms/theme/",
        r"indigo/cms/static/sass/partials/cms/theme/",
    ]
)


# init script: set theme automatically
with open(
    os.path.join(
        str(importlib_resources.files("tutorindigo") / "templates"),
        "indigo",
        "tasks",
        "init.sh",
    ),
    encoding="utf-8",
) as task_file:
    hooks.Filters.CLI_DO_INIT_TASKS.add_item(("lms", task_file.read()))


# Override openedx & mfe docker image names
@hooks.Filters.CONFIG_DEFAULTS.add(priority=hooks.priorities.LOW)
def _override_openedx_docker_image(
    items: list[tuple[str, t.Any]],
) -> list[tuple[str, t.Any]]:
    openedx_image = ""
    mfe_image = ""
    for k, v in items:
        if k == "DOCKER_IMAGE_OPENEDX":
            openedx_image = v
        elif k == "MFE_DOCKER_IMAGE":
            mfe_image = v
    if openedx_image:
        items.append(("DOCKER_IMAGE_OPENEDX", f"{openedx_image}-indigo"))
    if mfe_image:
        items.append(("MFE_DOCKER_IMAGE", f"{mfe_image}-indigo"))
    return items


# Load all configuration entries
hooks.Filters.CONFIG_DEFAULTS.add_items(
    [(f"INDIGO_{key}", value) for key, value in config["defaults"].items()]
)
hooks.Filters.CONFIG_UNIQUE.add_items(
    [(f"INDIGO_{key}", value) for key, value in config["unique"].items()]
)
hooks.Filters.CONFIG_OVERRIDES.add_items(list(config["overrides"].items()))


#  MFEs that are styled using Indigo
indigo_styled_mfes = [
    "learning",
    "learner-dashboard",
    "profile",
    "account",
    "discussions",
    "communications",
    "gradebook",
    "ora-grading"
]

for mfe in indigo_styled_mfes:
    hooks.Filters.ENV_PATCHES.add_items(
        [
            (
                f"mfe-dockerfile-post-npm-install-{mfe}",
                """
RUN npm install '@edx/brand@github:@FinishingX/finishingx-brand#finishingx-brand'
""",  # noqa: E501
            ),
        ]
    )

hooks.Filters.ENV_PATCHES.add_item(
    (
        "mfe-dockerfile-post-npm-install-authn",
        "RUN npm install '@edx/brand@github:@FinishingX/finishingx-brand#finishingx-brand'",
    )
)
hooks.Filters.ENV_PATCHES.add_item(
    (
        "mfe-dockerfile-post-npm-install-authoring",
        "RUN npm install '@edx/brand@github:@FinishingX/finishingx-brand#finishingx-brand'",
    )
)

# Include js file in lms main.html, main_django.html, and certificate.html

hooks.Filters.ENV_PATCHES.add_items(
    [
        # for production
        (
            "openedx-common-assets-settings",
            """
javascript_files = ['base_application', 'application', 'certificates_wv']
dark_theme_filepath = ['indigo/js/dark-theme.js']

for filename in javascript_files:
    if filename in PIPELINE['JAVASCRIPT']:
        PIPELINE['JAVASCRIPT'][filename]['source_filenames'] += dark_theme_filepath
""",
        ),
        # for development
        (
            "openedx-lms-development-settings",
            """
javascript_files = ['base_application', 'application', 'certificates_wv']
dark_theme_filepath = ['indigo/js/dark-theme.js']

for filename in javascript_files:
    if filename in PIPELINE['JAVASCRIPT']:
        PIPELINE['JAVASCRIPT'][filename]['source_filenames'] += dark_theme_filepath

MFE_CONFIG['INDIGO_ENABLE_DARK_TOGGLE'] = {{ INDIGO_ENABLE_DARK_TOGGLE }}
MFE_CONFIG['INDIGO_ENABLE_LANGUAGE_MENU'] = {{ INDIGO_ENABLE_LANGUAGE_MENU }}
MFE_CONFIG['INDIGO_SUPPORTED_LANGUAGES'] = {{ INDIGO_SUPPORTED_LANGUAGES }}
MFE_CONFIG['INDIGO_FOOTER_NAV_LINKS'] = {{ INDIGO_FOOTER_NAV_LINKS }}
""",
        ),
        (
            "openedx-lms-production-settings",
            """
MFE_CONFIG['INDIGO_ENABLE_DARK_TOGGLE'] = {{ INDIGO_ENABLE_DARK_TOGGLE }}
MFE_CONFIG['INDIGO_ENABLE_LANGUAGE_MENU'] = {{ INDIGO_ENABLE_LANGUAGE_MENU }}
MFE_CONFIG['INDIGO_SUPPORTED_LANGUAGES'] = {{ INDIGO_SUPPORTED_LANGUAGES }}
MFE_CONFIG['INDIGO_FOOTER_NAV_LINKS'] = {{ INDIGO_FOOTER_NAV_LINKS }}
""",
        ),
    ]
)


# Add react components and patches from tutor-indigo
for path in itertools.chain(
    glob(
        os.path.join(str(importlib_resources.files("tutorindigo") / "components"), "*")
    ),
    glob(os.path.join(str(importlib_resources.files("tutorindigo") / "patches"), "*")),
):
    with open(path, encoding="utf-8") as patch_file:
        hooks.Filters.ENV_PATCHES.add_item((os.path.basename(path), patch_file.read()))


for mfe in indigo_styled_mfes:
    PLUGIN_SLOTS.add_item(
        (
            mfe,
            "org.openedx.frontend.layout.footer.v1",
            """
            {
                op: PLUGIN_OPERATIONS.Hide,
                widgetId: 'default_contents',
            },
            {
                op: PLUGIN_OPERATIONS.Insert,
                widget: {
                    id: 'indigo_footer',
                    type: DIRECT_PLUGIN,
                    priority: 1,
                    RenderWidget: IndigoFooter,
                },
            },
            {
                op: PLUGIN_OPERATIONS.Insert,
                widget: {
                    id: 'read_theme_cookie',
                    type: DIRECT_PLUGIN,
                    priority: 2,
                    RenderWidget: AddDarkTheme,
                },
            },
  """,
        ),
    )


# ---------------------------------------------------------------------------
# Header overrides — replace the native header with the FinishingX marketing
# header (CustomHeader) on every Indigo-styled MFE. Ported from the TitanEd/
# tels tutor-indigo fork; adapted because FinishingX has no "public" marketing
# MFE (marketing pages are ulmo-theme Mako templates on the LMS domain, see
# CustomHeader.jsx) and no Control Hub app.
#
# Slot ids are NOT interchangeable — applying header_desktop.v1 to an MFE that
# renders <LearningHeader/> (or header_learning.v1 to one that never mounts
# that slot) silently no-ops, it does not fall back to the other family:
#   account / profile / gradebook / learner-dashboard
#       -> native <Header/> only (DesktopHeaderSlot + MobileHeaderSlot,
#          i.e. org.openedx.frontend.layout.header_desktop.v1 / _mobile.v1)
#   learning
#       -> both: <LearningHeader/> on course pages via its own HeaderSlot
#          (org.openedx.frontend.layout.header_learning.v1), AND native
#          <Header/> on a few plain pages (e.g. preferences-unsubscribe)
#   discussions / communications / ora-grading
#       -> <LearningHeader/> only, but (unlike frontend-app-learning) these
#          MFEs don't wrap it in a PluginSlot upstream, so header_learning.v1
#          is injected at image-build time instead (see
#          LEARNING_HEADER_WRAP_FILES below).
# authn has no site header; authoring/Studio keeps its own StudioHeader —
# neither gets an entry here, matching prior behavior.
# ---------------------------------------------------------------------------

_DESKTOP_HEADER_SLOTS: list[tuple[str, str]] = [
    ("org.openedx.frontend.layout.header_desktop.v1", "custom_header_desktop"),
    ("org.openedx.frontend.layout.header_mobile.v1", "custom_header_mobile"),
]

_LEARNING_HEADER_SLOTS: list[tuple[str, str]] = [
    ("org.openedx.frontend.layout.header_learning.v1", "custom_header_learning"),
]

# mfe -> [(slot_id, widget_id)]
HEADER_REPLACEMENT_SLOTS: dict[str, list[tuple[str, str]]] = {
    "account": _DESKTOP_HEADER_SLOTS,
    "profile": _DESKTOP_HEADER_SLOTS,
    "gradebook": _DESKTOP_HEADER_SLOTS,
    "learner-dashboard": _DESKTOP_HEADER_SLOTS,
    "learning": _LEARNING_HEADER_SLOTS + _DESKTOP_HEADER_SLOTS,
    "discussions": _LEARNING_HEADER_SLOTS,
    "communications": _LEARNING_HEADER_SLOTS,
    "ora-grading": _LEARNING_HEADER_SLOTS,
}


def _custom_header_plugins(widget_id: str) -> str:
    return f"""
            {{
                op: PLUGIN_OPERATIONS.Hide,
                widgetId: 'default_contents',
            }},
            {{
                op: PLUGIN_OPERATIONS.Insert,
                widget: {{
                    id: '{widget_id}',
                    type: DIRECT_PLUGIN,
                    priority: 1,
                    RenderWidget: CustomHeader,
                }},
            }},
"""


for mfe, _slots in HEADER_REPLACEMENT_SLOTS.items():
    for slot_id, widget_id in _slots:
        PLUGIN_SLOTS.add_item((mfe, slot_id, _custom_header_plugins(widget_id)))


# LearningHeader apps that don't mount header_learning.v1 in upstream source
# (discussions/communications/ora-grading). Wrap their <Header /> at image
# build time (after COPY of the MFE source, right before `npm run build`, via
# the mfe-dockerfile-pre-npm-build-{mfe} hook) so the PLUGIN_SLOTS entries
# above have a slot to attach to — no MFE-side git fork required. Fails the
# image build loudly if the expected import/JSX shape isn't found, rather
# than silently no-op-ing.
#
# NOTE: these 3 MFEs aren't checked out in this workspace, so the relative
# paths below (matching the upstream file layout at the time of writing)
# should be double-checked against FinishingX's actual forks before relying
# on this in a real build.
LEARNING_HEADER_WRAP_FILES = {
    "discussions": "src/discussions/discussions-home/DiscussionsHome.jsx",
    "communications": "src/components/page-container/PageContainer.jsx",
    "ora-grading": "src/App.jsx",
}


def _learning_header_wrap_dockerfile(relpath: str) -> str:
    path_js = json.dumps(relpath)
    return f"""
RUN node <<'EOF'
const fs = require('fs');
const p = {path_js};
let t = fs.readFileSync(p, 'utf8');
if (t.includes('org.openedx.frontend.layout.header_learning.v1')) {{
  process.exit(0);
}}
const headerFrom = "from '@edx/frontend-component-header';";
const headerImport = "import {{ LearningHeader as Header }} " + headerFrom;
if (!t.includes(headerImport)) {{
  console.error('CustomHeader wrap: LearningHeader import not found in', p);
  process.exit(1);
}}
const fpfImport = "import {{ PluginSlot }} from '@openedx/frontend-plugin-framework';";
if (!t.includes('@openedx/frontend-plugin-framework')) {{
  t = t.replace(headerImport, fpfImport + "\\n" + headerImport);
}}
const slotId = 'org.openedx.frontend.layout.header_learning.v1';
const wrapped = t.replace(
  /<Header([\\s\\S]*?)\\/>/,
  '<PluginSlot id="' + slotId + '"><Header$1/></PluginSlot>'
);
if (wrapped === t) {{
  console.error('CustomHeader wrap: <Header /> not found in', p);
  process.exit(1);
}}
fs.writeFileSync(p, wrapped);
console.log('Wrapped LearningHeader in', p);
EOF
"""


for _mfe, _relpath in LEARNING_HEADER_WRAP_FILES.items():
    _patch_name = f"mfe-dockerfile-pre-npm-build-{_mfe}"
    hooks.Filters.ENV_PATCHES.add_item(
        (_patch_name, _learning_header_wrap_dockerfile(_relpath))
    )


PLUGIN_SLOTS.add_items(
    [
        (
            "learning",
            "learning_help_slot",
            """
        {
            op: PLUGIN_OPERATIONS.Hide,
            widgetId: 'default_contents',
        }
        """,
        )
    ]
)
paragon_theme_urls = {
    "variants": {
        "light": {
            "urls": {
                "default": "http://localhost:2000/static/paragon/themes/light/light.min.css",
                "brandOverride": "http://localhost:2000/static/paragon/themes/light/light.min.css",
            },
        },
        "dark": {
            "urls": {
                "default": "http://localhost:2000/static/paragon/themes/dark/dark.min.css",
                "brandOverride": "http://localhost:2000/static/paragon/themes/dark/dark.min.css",
            }
        },
    }
}

fstring = f"""
MFE_CONFIG["PARAGON_THEME_URLS"] = {json.dumps(paragon_theme_urls)}
"""

hooks.Filters.ENV_PATCHES.add_item(("mfe-lms-common-settings", fstring))


@MFE_APPS.add()  # type: ignore
def _add_themed_logo(
    mfes: dict[str, MFE_ATTRS_TYPE],
) -> dict[str, MFE_ATTRS_TYPE]:
    for mfe in mfes:
        PLUGIN_SLOTS.add_item(
            (
                str(mfe),
                "logo_slot",
                """
                {
                    op: PLUGIN_OPERATIONS.Hide,
                    widgetId: 'default_contents',
                },
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget: {
                        id: 'custom_logo',
                        type: DIRECT_PLUGIN,
                        RenderWidget: ThemedLogo,
                    }
                }
            """,
            )
        )

    return mfes
