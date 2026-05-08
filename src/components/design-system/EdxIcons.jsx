/**
 * edXponential Custom SVG Icon System
 * Unified stroke weight: 1.5px | Corner radius: 2px | Style: minimal, geometric, premium
 */

import React from 'react';

const base = (path, viewBox = '0 0 24 24') => ({ className, size = 20, color = 'currentColor', ...props }) => (
  <svg
    width={size} height={size} viewBox={viewBox} fill="none"
    stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className={className} {...props}
  >
    {path}
  </svg>
);

// Education & Growth
export const EdxBookIcon = base(
  <><rect x="3" y="3" width="13" height="17" rx="2"/><path d="M8 3v17"/><path d="M16 7h4v14H8"/></>
);
export const EdxGradCapIcon = base(
  <><path d="M12 2L2 8l10 6 10-6-10-6z"/><path d="M6 11v5c0 2 2.5 4 6 4s6-2 6-4v-5"/><path d="M20 8v7"/></>
);
export const EdxGrowthIcon = base(
  <><polyline points="3,17 9,11 13,14 21,6"/><polyline points="14,6 21,6 21,13"/></>
);
export const EdxTargetIcon = base(
  <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></>
);

// AI & Intelligence
export const EdxAIIcon = base(
  <><path d="M12 2a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 1 0 4h-1a2 2 0 0 0-2 2v1a2 2 0 0 1-4 0v-1a2 2 0 0 0-2-2H7a2 2 0 0 1 0-4h1a2 2 0 0 0 2-2V4a2 2 0 0 1 2-2z"/></>
);
export const EdxSparkIcon = base(
  <><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></>
);
export const EdxNeuralIcon = base(
  <><circle cx="12" cy="12" r="2"/><circle cx="5" cy="7" r="1.5"/><circle cx="19" cy="7" r="1.5"/><circle cx="5" cy="17" r="1.5"/><circle cx="19" cy="17" r="1.5"/><line x1="10.5" y1="11" x2="6.5" y2="8"/><line x1="13.5" y1="11" x2="17.5" y2="8"/><line x1="10.5" y1="13" x2="6.5" y2="16"/><line x1="13.5" y1="13" x2="17.5" y2="16"/></>
);

// People & Connection
export const EdxPeopleIcon = base(
  <><circle cx="9" cy="7" r="3"/><circle cx="16" cy="7" r="2.5"/><path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16.5 13c2.5 0 4.5 2 4.5 4.5"/></>
);
export const EdxConnectIcon = base(
  <><circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><line x1="8.7" y1="10.7" x2="15.3" y2="7.3"/><line x1="8.7" y1="13.3" x2="15.3" y2="16.7"/></>
);
export const EdxMentorIcon = base(
  <><circle cx="12" cy="8" r="4"/><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M12 14v4"/><path d="M9 19l3 2 3-2"/></>
);

// Platform modules
export const EdxCommunityIcon = base(
  <><rect x="2" y="4" width="9" height="7" rx="1.5"/><rect x="13" y="4" width="9" height="7" rx="1.5"/><rect x="6" y="14" width="12" height="6" rx="1.5"/></>
);
export const EdxDiscoverIcon = base(
  <><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 8v3l2 2"/></>
);
export const EdxVerifiedIcon = base(
  <><path d="M12 2l2.4 4.9L20 8l-4 3.9.9 5.4L12 15l-4.9 2.3.9-5.4L4 8l5.6-1.1L12 2z"/><polyline points="9,12 11,14 15,10"/></>
);

// Actions
export const EdxSendIcon = base(
  <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></>
);
export const EdxUnlockIcon = base(
  <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/></>
);
export const EdxCrownIcon = base(
  <><path d="M2 17L6 7l6 5 6-5 4 10H2z"/><line x1="2" y1="21" x2="22" y2="21"/></>
);

export default {
  EdxBookIcon, EdxGradCapIcon, EdxGrowthIcon, EdxTargetIcon,
  EdxAIIcon, EdxSparkIcon, EdxNeuralIcon,
  EdxPeopleIcon, EdxConnectIcon, EdxMentorIcon,
  EdxCommunityIcon, EdxDiscoverIcon, EdxVerifiedIcon,
  EdxSendIcon, EdxUnlockIcon, EdxCrownIcon,
};