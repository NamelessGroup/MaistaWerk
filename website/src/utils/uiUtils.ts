/**
 * Checks if the mobile styling currently applies
 * @returns Whether the css media query for mobile devices is matched
 */
export function isMobile(): boolean {
  return window.matchMedia('(max-width: 768px)').matches
}