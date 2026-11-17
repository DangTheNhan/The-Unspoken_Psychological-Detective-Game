const paths = {
  overview: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  users:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  bugs: 'M9 9h6a3 3 0 0 1 3 3v3a6 6 0 0 1-12 0v-3a3 3 0 0 1 3-3Z M9 9V6a3 3 0 0 1 6 0v3 M3 12h3 M18 12h3 M3 18h4 M17 18h4 M12 9v12',
  evidence: 'M3 7h7l2 2h9v11H3Z M3 7V4h7l2 3 M8 14h8 M8 17h5',
  story: 'M4 3h12l4 4v14H4Z M14 3v6h6 M8 13h8 M8 17h6',
  operations: 'M12 3v7 M5.64 5.64a9 9 0 1 0 12.72 0',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
  close: 'M6 6l12 12 M18 6 6 18',
  chevron: 'm9 5 7 7-7 7',
}
export function AdminIcon({ name, size = 19 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.overview} />
    </svg>
  )
}
