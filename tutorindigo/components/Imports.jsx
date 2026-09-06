import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import Cookies from 'universal-cookie';

import {
  getConfig, subscribe, APP_I18N_INITIALIZED,
} from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { Icon } from '@openedx/paragon';
import {
  Close, ExpandMore, MenuIcon, Nightlight, WbSunny,
} from '@openedx/paragon/icons';
import { useIntl, mergeMessages } from '@edx/frontend-platform/i18n';
