/**
 * edXponential Design System — Central Export
 * Import from here for consistency across all modules.
 *
 * Usage:
 *   import { EdxButton, EdxCard, EdxBadge, EdxAvatar, EdxLoader } from '@/components/design-system';
 */

// Core components
export { default as EdxButton, EdxIconButton } from './EdxButton';
export { default as EdxCard, EdxStatCard } from './EdxCard';
export { default as EdxBadge } from './EdxBadge';
export { default as EdxAvatar, EdxAvatarGroup } from './EdxAvatar';

// Loaders & wait states
export {
  EdxSpinner,
  EdxAIPulse,
  EdxProgressBar,
  EdxPageLoader,
  EdxSkeleton,
  EdxCardSkeleton,
  EdxButtonLoader,
} from './EdxLoader';

// Empty states
export { default as EdxEmptyState } from './EdxEmptyState';

// Reactions
export { default as EdxReactions, EdxReactionSummary, REACTIONS } from './EdxReactions';

// Emoji system
export { default as EdxEmoji, EDX_EMOJI } from './EdxEmoji';

// Icons
export * from './EdxIcons';