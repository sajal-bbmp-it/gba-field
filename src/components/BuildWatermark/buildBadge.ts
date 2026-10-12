import { APP_ENV, ENV_LABEL, IS_UNCONFIGURED } from '../../config/env';
import { colors } from '../../theme';

const ENV_COLOR: Record<string, string> = {
  local: colors.info,
  test: colors.warn,
};

export interface BuildBadge {
  label: string;
  color: string;
}

// What the header badge shows, or null to hide it. Hidden when ENV_LABEL is
// empty (prod), unless the API URL is still a CHANGE-ME placeholder.
export function getBuildBadge(): BuildBadge | null {
  if (IS_UNCONFIGURED) {
    return { label: 'UNCONFIGURED BUILD', color: colors.danger };
  }
  if (!ENV_LABEL) {
    return null;
  }
  return {
    label: `${ENV_LABEL.toUpperCase()} BUILD`,
    color: ENV_COLOR[APP_ENV] || colors.muted,
  };
}
