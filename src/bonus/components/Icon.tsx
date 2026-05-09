export default function Icon({ name, className }: any) {
  switch (name) {
    case 'bolt':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M12 2 20 6v6c0 5-3.2 9.4-8 10-4.8-.6-8-5-8-10V6l8-4Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9 12.2 11 14.2 15.4 9.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'steps':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M4 18h6v-4H4v4Zm0-6h10V8H4v4Zm0-6h16V2H4v4Zm8 16h8v-6h-8v6Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'wallet':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M4 7.5V6a2 2 0 0 1 2-2h12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M16.8 12.2h2.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'check':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M20 6 9 17l-5-5"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M12 2l1.2 4.3L18 8l-4.8 1.7L12 14l-1.2-4.3L6 8l4.8-1.7L12 2Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M4 14l.8 2.8L8 18l-3.2 1.2L4 22l-.8-2.8L0 18l3.2-1.2L4 14Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      )
    default:
      return null
  }
}
