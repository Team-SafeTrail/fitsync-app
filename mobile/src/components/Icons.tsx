import React from "react";
import Svg, { Circle, Line, Path, Polyline, Rect } from "react-native-svg";

import { colors } from "../theme/tokens";

type IconProps = {
  size?: number;
  color?: string;
};

export function CheckCircleIcon({ size = 20, color = colors.success }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      importantForAccessibility="no-hide-descendants"
    >
      <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={2} />
      <Path
        d="M8.5 12.2l2.3 2.3 4.8-5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function AlertCircleIcon({ size = 20, color = colors.destructive }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      importantForAccessibility="no-hide-descendants"
    >
      <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={2} />
      <Line x1="12" y1="7.5" x2="12" y2="13" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="12" cy="16.5" r="1" fill={color} />
    </Svg>
  );
}

export function ArrowLeftIcon({ size = 20, color = colors.forest }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      importantForAccessibility="no-hide-descendants"
    >
      <Line x1="19" y1="12" x2="5" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Polyline
        points="11 6 5 12 11 18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function RefreshIcon({ size = 18, color = colors.forest }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      importantForAccessibility="no-hide-descendants"
    >
      <Path
        d="M20 12a8 8 0 1 1-2.34-5.66L20 8.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Polyline
        points="20 4 20 8.5 15.5 8.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function LogOutIcon({ size = 18, color = colors.forest }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      importantForAccessibility="no-hide-descendants"
    >
      <Path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Polyline
        points="16 17 21 12 16 7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function EyeIcon({ size = 20, color = colors.textSecondary }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      importantForAccessibility="no-hide-descendants"
    >
      <Path
        d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="2.8" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function EyeOffIcon({ size = 20, color = colors.textSecondary }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      importantForAccessibility="no-hide-descendants"
    >
      <Path
        d="M9.9 5.7A10.7 10.7 0 0 1 12 5.5c6.2 0 10 6.5 10 6.5a18.2 18.2 0 0 1-3.1 3.9M6.2 7.2A17.7 17.7 0 0 0 2 12s3.8 6.5 10 6.5a10.4 10.4 0 0 0 4.2-.9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="3" y1="3" x2="21" y2="21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function CalendarIcon({ size = 16, color = colors.jade }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      importantForAccessibility="no-hide-descendants"
    >
      <Rect x="3" y="5" width="18" height="16" rx="2.5" stroke={color} strokeWidth={2} />
      <Line x1="16" y1="3" x2="16" y2="7" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1="8" y1="3" x2="8" y2="7" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth={2} />
    </Svg>
  );
}
