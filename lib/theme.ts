
// Get saved theme from localStorage, if any
const savedTheme = localStorage.getItem('theme');

// Determine user's preferred theme: saved value or system preference
export const prefersTheme = savedTheme || (
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
);

// Booleans for easy checking
export const prefersDark = prefersTheme === 'dark';
export const prefersLight = prefersTheme === 'light';

// Optionally apply the theme to the document (if running in browser context)
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-theme', prefersTheme);
}

// Optional theme styles for dark mode
export const darkShadow1 = '0 6px 20px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.35)';
export const darkShadow = '0 12px 24px rgba(0, 0, 0, 0.7), 0 6px 12px rgba(0, 0, 0, 0.5)';
export const darkColor = '#121212';

// Optionally, listen to system preference changes if no theme is saved
if (!savedTheme) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    const newTheme = e.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    // You can also update prefersTheme here if needed
  });
}
