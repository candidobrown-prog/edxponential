/** Minimum group size suppression for aggregates (re-identification protection, F44). */
export function suppress(count, minGroup = 5) { return count < minGroup; }
