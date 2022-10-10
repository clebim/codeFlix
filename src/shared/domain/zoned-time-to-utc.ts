import { zonedTimeToUtc } from 'date-fns-tz';

import { getLocalTimeZone } from '@shared/get-local-timezone';

export const convertZonedTimeToUtc = (date: Date, timezone?: string) => {
  return zonedTimeToUtc(date, timezone ?? getLocalTimeZone());
};
