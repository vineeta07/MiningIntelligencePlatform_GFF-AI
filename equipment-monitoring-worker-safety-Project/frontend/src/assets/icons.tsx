export type IconProps = { className?: string };

export const IconGrid = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

export const IconTruck = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M2 7h11v10H2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M13 10h4.5l3.5 3.5V17h-8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <circle cx="6.5" cy="18.5" r="1.8" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="17" cy="18.5" r="1.8" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

export const IconUsers = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <circle cx="17" cy="7" r="2.4" stroke="currentColor" strokeWidth="1.7" />
    <path d="M15.5 13.2c2.9.4 5 2.9 5 5.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconAlert = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3 2 20h20L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M12 10v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <circle cx="12" cy="17" r="0.9" fill="currentColor" />
  </svg>
);

export const IconShield = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 3.2 4.5 6v5.4c0 4.6 3.1 8.3 7.5 9.4 4.4-1.1 7.5-4.8 7.5-9.4V6L12 3.2Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="M8.7 12.2 11 14.5l4.6-4.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconReports = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 3.5h9L19.5 8v12.5H6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M14.5 3.5V8h5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M8.5 12.5h7M8.5 15.5h7M8.5 18.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconSettings = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4M17.7 17.7l-1.4-1.4M7.7 7.7 6.3 6.3"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

export const IconMenu = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconChevron = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconBell = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M6 9a6 6 0 1 1 12 0c0 4.2 1.2 5.8 1.8 6.6H4.2C4.8 14.8 6 13.2 6 9Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="M10 18.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconSearch = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="m20 20-4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconGauge = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 15a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M12 15 15.5 9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <circle cx="12" cy="15" r="1.1" fill="currentColor" />
  </svg>
);

export const IconHelmet = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3.5 16.5c0-5 3.8-9 8.5-9s8.5 4 8.5 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M2.5 16.5h19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M12 7.5V5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconEdit = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M4 20h4.2L18.8 9.4a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0L4 15.8V20Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconTrash = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 7h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M9 7V4.8c0-.4.4-.8.9-.8h4.2c.5 0 .9.4.9.8V7" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M6.5 7 7.3 19.2c0 .6.5 1 1 1h7.4c.5 0 1-.4 1-1L17.5 7" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M10 11v5M14 11v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconPlus = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

export const IconClose = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconLogo = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2 3 6.5v6.2C3 17.6 6.9 21 12 22c5.1-1 9-4.4 9-9.3V6.5L12 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M8.4 12.3l2.6 2.6 4.6-5.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
