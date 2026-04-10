import { useState } from 'react';

export function SkipToContent() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <a
      href="#main-content"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`fixed top-4 left-4 z-[9999] px-6 py-3 bg-accent text-white font-bold rounded-full shadow-xl transition-transform duration-300 ${
        isFocused ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'
      }`}
      aria-label="Skip to main content"
    >
      Skip to Content
    </a>
  );
}

export default SkipToContent;
