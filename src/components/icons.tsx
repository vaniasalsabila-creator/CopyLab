import type { ReactElement, SVGProps } from 'react'

export type IconName =
  | 'search'
  | 'folder'
  | 'plus'
  | 'chevron-down'
  | 'chevron-right'
  | 'chevron-left'
  | 'more'
  | 'star'
  | 'star-filled'
  | 'share'
  | 'save'
  | 'close'
  | 'check'
  | 'alert'
  | 'copy'
  | 'trash'
  | 'pencil'
  | 'move'
  | 'menu'
  | 'eye'
  | 'grid'
  | 'clock'
  | 'whatsapp'
  | 'bell'
  | 'expand'
  | 'layers'
  | 'file'
  | 'signal'
  | 'wifi'
  | 'battery'
  | 'sun'
  | 'moon'
  | 'phone'
  | 'video'
  | 'badge-check'
  | 'flashlight'
  | 'camera'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'quote'
  | 'list'
  | 'paragraph'
  | 'sms'

const paths: Record<IconName, ReactElement> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  'chevron-left': <path d="m15 6-6 6 6 6" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </>
  ),
  star: <path d="m12 3 2.7 5.9 6.3.6-4.7 4.4 1.3 6.3L12 17.3 6.4 20.2l1.3-6.3-4.7-4.4 6.3-.6z" />,
  'star-filled': <path fill="currentColor" stroke="none" d="m12 3 2.7 5.9 6.3.6-4.7 4.4 1.3 6.3L12 17.3 6.4 20.2l1.3-6.3-4.7-4.4 6.3-.6z" />,
  share: (
    <>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.7 15.8 6.3M8.2 13.3l7.6 4.4" />
    </>
  ),
  save: (
    <>
      <path d="M5 4h11l3 3v13H5z" />
      <path d="M8 4v5h8V4" />
      <path d="M8 20v-6h8v6" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </>
  ),
  check: <path d="m5 13 4 4 10-10" />,
  alert: (
    <>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.9 2.6 17.5A1.5 1.5 0 0 0 4 20h16a1.5 1.5 0 0 0 1.3-2.5L13.7 3.9a1.5 1.5 0 0 0-2.6 0Z" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7h12l-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  ),
  pencil: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  move: (
    <>
      <path d="M5 9v6" />
      <path d="M19 9v6" />
      <path d="M3 12h18" />
      <path d="m9 6 3-3 3 3" />
      <path d="m9 18 3 3 3-3" />
    </>
  ),
  menu: (
    <>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
  whatsapp: (
    <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm0 0M8.5 8.4c.2-.5.5-.5.7-.5h.5c.2 0 .4 0 .6.4.2.5.7 1.6.7 1.7.1.1.1.3 0 .4-.1.2-.1.3-.3.4-.1.2-.3.3-.4.5-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1 .2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.3.1.2.1.9-.2 1.4-.3.6-1.6 1.2-2.2 1.2-.6 0-1.3.1-4.3-1.2-3.5-1.5-5.7-5.2-5.9-5.4-.2-.2-1.3-1.7-1.3-3.2 0-1.5.8-2.3 1.1-2.6Z" />
  ),
  bell: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  expand: (
    <>
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v3" />
      <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  file: (
    <>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5" />
    </>
  ),
  signal: (
    <>
      <rect x="2" y="14" width="3.5" height="6" rx="0.75" fill="currentColor" stroke="none" />
      <rect x="7.5" y="10.5" width="3.5" height="9.5" rx="0.75" fill="currentColor" stroke="none" />
      <rect x="13" y="7" width="3.5" height="13" rx="0.75" fill="currentColor" stroke="none" />
      <rect x="18.5" y="3.5" width="3.5" height="16.5" rx="0.75" fill="currentColor" stroke="none" />
    </>
  ),
  wifi: (
    <>
      <path d="M3.5 9a12.5 12.5 0 0 1 17 0" />
      <path d="M6.75 12.75a8 8 0 0 1 10.5 0" />
      <path d="M10 16.25a3.25 3.25 0 0 1 4 0" />
      <circle cx="12" cy="19.5" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  battery: (
    <>
      <rect x="1.5" y="7.5" width="19" height="9" rx="2.5" />
      <rect x="3.25" y="9.25" width="15.5" height="5.5" rx="1.25" fill="currentColor" stroke="none" />
      <path d="M22.5 10.5v3" fill="none" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
    </>
  ),
  moon: <path d="M20.5 14.8A8.5 8.5 0 1 1 9.2 3.5a7 7 0 0 0 11.3 11.3Z" />,
  phone: (
    <path d="M5.5 4h2.7l1.3 4-1.9 1.6a11 11 0 0 0 5.3 5.3l1.6-1.9 4 1.3v2.7a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 3.5 6.1 2 2 0 0 1 5.5 4Z" />
  ),
  video: (
    <>
      <rect x="2.5" y="6.5" width="13" height="11" rx="2" />
      <path d="m21.5 8-5 3v2l5 3z" />
    </>
  ),
  'badge-check': (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
      <path d="m8.2 12.3 2.4 2.4 5.2-5.2" stroke="white" strokeWidth={2} />
    </>
  ),
  flashlight: (
    <>
      <path d="M8 2h8l-1.5 6H16l-6 12 1-8H8.5z" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8a2 2 0 0 1 2-2h1.5l1-1.5h7l1 1.5H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  bold: (
    <>
      <path d="M6 4h8a4 4 0 0 1 0 8H6z" />
      <path d="M6 12h9a4 4 0 0 1 0 8H6z" />
    </>
  ),
  italic: (
    <>
      <path d="M19 4h-9" />
      <path d="M14 20H5" />
      <path d="m15 4-6 16" />
    </>
  ),
  underline: (
    <>
      <path d="M6 4v6a6 6 0 0 0 12 0V4" />
      <path d="M4 20h16" />
    </>
  ),
  quote: (
    <>
      <path d="M7 15c2.5 0 3.5-1.7 3.5-4V6a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v4.5A1.5 1.5 0 0 0 5.5 12c.8 0 1 .3 1 1v.5C6.5 14.5 6 15 5 15" />
      <path d="M17 15c2.5 0 3.5-1.7 3.5-4V6a1 1 0 0 0-1-1h-4.5a1 1 0 0 0-1 1v4.5a1.5 1.5 0 0 0 1.5 1.5c.8 0 1 .3 1 1v.5c0 1-.5 1.5-1.5 1.5" />
    </>
  ),
  list: (
    <>
      <circle cx="4" cy="6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1.1" fill="currentColor" stroke="none" />
      <path d="M8 6h12" />
      <path d="M8 12h12" />
      <path d="M8 18h12" />
    </>
  ),
  paragraph: (
    <>
      <path d="M13 4v16" />
      <path d="M18 4v16" />
      <path d="M18 4h-7.5a4.5 4.5 0 0 0 0 9H13" />
    </>
  ),
  sms: (
    <>
      <path d="M3.5 5.5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4.5 4v-4H5.5a2 2 0 0 1-2-2Z" />
      <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
    </>
  ),
}

export function Icon({ name, size = 16, className, ...props }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}
