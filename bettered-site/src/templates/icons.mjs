/* EdSolution icons: heart (School Health), head (Leader Development), hand (Teacher Development), body (Intensive Care).
   32px line icons, 1.8 stroke, square caps; the gold plus is "care" applied to each part of the school. */
export const ICONS = {
  heart: '<path d="M16 27 5.6 16.6a6.2 6.2 0 0 1 8.8-8.8L16 9.4l1.6-1.6a6.2 6.2 0 0 1 8.8 8.8Z"/><path class="acc" d="M16 12.6v6.4M12.8 15.8h6.4"/>',
  head: '<path d="M11 28v-4.6A9.6 9.6 0 0 1 6.5 15 9.5 9.5 0 0 1 16 5.5c4.9 0 8.9 3.7 9.4 8.5l2.1 4h-2.1v3.4a2.6 2.6 0 0 1-2.6 2.6H20V28"/><path class="acc" d="M15.5 10.6v6.4M12.3 13.8h6.4"/>',
  hand: '<path d="M11 16V7.5a1.9 1.9 0 0 1 3.8 0V15M14.8 14V5.6a1.9 1.9 0 0 1 3.8 0V15M18.6 15V7.4a1.9 1.9 0 0 1 3.8 0V16M22.4 15.5v-4.6a1.9 1.9 0 0 1 3.8 0V19c0 5-3.6 8.5-8.4 8.5h-1.6c-2.6 0-4.4-1-6-2.9L5.4 19.6a2 2 0 0 1 2.9-2.8L11 19.5"/><path class="acc" d="M18.4 18.2v5.4M15.7 20.9h5.4"/>',
  body: '<circle cx="16" cy="6.6" r="3.1"/><path d="M11.2 28.5V21H8.6v-6.6a3.6 3.6 0 0 1 3.6-3.6h7.6a3.6 3.6 0 0 1 3.6 3.6V21h-2.6v7.5M16 22.6v5.9"/><path class="acc" d="M16 13.6v5.4M13.3 16.3h5.4"/>',
};
export const icon = (name, label = '') => `<svg class="icon icon-${name}" viewBox="0 0 32 32" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"'}>${ICONS[name]}</svg>`;
