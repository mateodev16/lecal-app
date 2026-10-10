import type { ComponentType, ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

function make(paths: ReactNode, strokeWidth = 1.75): ComponentType<IconProps> {
  return function Icon(props: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {paths}
      </svg>
    );
  };
}

export const IconPin = make(
  <>
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </>,
);

export const IconPhone = make(
  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />,
);

export const IconMail = make(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </>,
);

export const IconClock = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
);

export const IconArrowR = make(<path d="M5 12h14M13 6l6 6-6 6" />, 2);

export const IconMenu = make(<path d="M4 7h16M4 12h16M4 17h16" />, 2);

export const IconClose = make(<path d="M6 6l12 12M18 6 6 18" />, 2);

export const IconUp = make(<path d="M12 19V5M6 11l6-6 6 6" />, 2);

export const IconPlus = make(<path d="M12 5v14M5 12h14" />, 2);

export const IconCheck = make(<path d="M9 12l2 2 4-4" />, 2);

export const IconCheckCircle = make(
  <>
    <path d="M9 12l2 2 4-4" />
    <circle cx="12" cy="12" r="9" />
  </>,
);

export const IconShieldCheck = make(
  <>
    <path d="M9 12l2 2 4-4" />
    <path d="M12 3 4 6v6c0 5 3.4 7.8 8 9 4.6-1.2 8-4 8-9V6Z" />
  </>,
);

export const IconLeaf = make(
  <path d="M12 21c-4.4 0-8-3.6-8-8a8 8 0 0 1 16 0c0 4.4-3.6 8-8 8Z" />,
);

export const IconSprout = make(
  <>
    <path d="M12 20v-7" />
    <path d="M12 13c0-3 2-5 5.5-5C17.5 11 15 13 12 13Z" />
    <path d="M12 13c0-3-2-5-5.5-5C6.5 11 9 13 12 13Z" />
  </>,
);

export const IconScissor = make(
  <>
    <circle cx="6.5" cy="7" r="2.5" />
    <circle cx="17.5" cy="7" r="2.5" />
    <path d="M8 9l8 8M16 9l-8 8" />
  </>,
);

export const IconAxe = make(
  <>
    <path d="M14 4l6 6-9.5 9.5a2 2 0 0 1-2.8 0L4 15.8a2 2 0 0 1 0-2.8Z" />
    <path d="M11 7l6 6" />
  </>,
);

export const IconTruck = make(
  <>
    <path d="M2 16h13a3 3 0 1 0-3-3" />
    <path d="M15 16h3l3-3.5V9h-5" />
    <circle cx="6" cy="18.5" r="1.7" />
    <circle cx="17" cy="18.5" r="1.7" />
  </>,
);

export const IconRoad = make(
  <>
    <path d="M11 3 4 21h3l1.5-4h7L17 21h3L13 3Z" />
    <path d="M9.5 13 12 7l2.5 6Z" />
  </>,
);

export const IconDroplet = make(
  <>
    <path d="M12 3c3 4 6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 3-6 6-10Z" />
    <path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5" />
  </>,
);

export const IconFire = make(
  <>
    <path d="M12 3c.5 3 3 3.5 3 7a3 3 0 0 1-6 0c0-.9.4-1.6.9-2.2.4.9 1.1 1.2 1.1 1.2C10.4 7.4 11 5.5 12 3Z" />
    <path d="M8 13c-2 2-2 5-2 5s3-.5 5-2" />
    <path d="M16 13c2 2 2 5 2 5s-3-.5-5-2" />
  </>,
);

export const IconPlant = make(
  <>
    <path d="M7 11h10l-1.2 8.2a1 1 0 0 1-1 .8H9.2a1 1 0 0 1-1-.8Z" />
    <path d="M12 11c0-4 2.5-6 5-6 0 3.5-2 5.5-5 6Z" />
    <path d="M12 11c0-3-2-5-4.5-5C7.5 8.5 9.5 10.5 12 11Z" />
  </>,
);

export const IconTree = make(
  <>
    <path d="M12 3 4 6v6c0 5 3.4 7.8 8 9 4.6-1.2 8-4 8-9V6Z" />
    <path d="M12 8v5M9.5 10.5h5" />
  </>,
);

export const IconUsers = make(
  <>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M14 20c0-2.2 1.6-4 4-4 1.4 0 3 .8 3 2" />
  </>,
);

export const IconAlert = make(
  <>
    <path d="M12 8v5M12 16.5v.5" />
    <path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
  </>,
  2,
);

export const SERVICE_ICONS: Record<string, ComponentType<IconProps>> = {
  sprout: IconSprout,
  scissor: IconScissor,
  axe: IconAxe,
  truck: IconTruck,
  road: IconRoad,
  droplet: IconDroplet,
  fire: IconFire,
  plant: IconPlant,
};