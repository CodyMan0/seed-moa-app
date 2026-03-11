/**
 * Growth stage color helpers for the seed/earth-tone design system.
 *
 * Stages:
 *  1 - Seed    (씨앗)
 *  2 - Sprout  (새싹)
 *  3 - Stem    (줄기)
 *  4 - Bud     (꽃봉오리)
 *  5 - Bloom   (꽃)
 */

export type GrowthStage = 1 | 2 | 3 | 4 | 5;

/**
 * Determine a growth stage (1-5) from review count and optional status.
 */
export function getGrowthStage(
  reviewCount: number | null | undefined,
  status?: string | null,
): GrowthStage {
  if (status === 'mastered') return 5;
  const count = reviewCount ?? 0;
  if (count >= 20) return 5;
  if (count >= 12) return 4;
  if (count >= 6) return 3;
  if (count >= 2) return 2;
  return 1;
}

/**
 * Return a Tailwind bg-* class for the given growth stage.
 */
export function getGrowthColor(stage: GrowthStage): string {
  switch (stage) {
    case 1:
      return 'bg-seed';
    case 2:
      return 'bg-sprout-light';
    case 3:
      return 'bg-sprout';
    case 4:
      return 'bg-bloom-light';
    case 5:
      return 'bg-bloom';
  }
}

/**
 * Return a Tailwind text-* class for the given growth stage.
 */
export function getGrowthTextColor(stage: GrowthStage): string {
  switch (stage) {
    case 1:
      return 'text-seed';
    case 2:
      return 'text-sprout-light';
    case 3:
      return 'text-sprout';
    case 4:
      return 'text-bloom-light';
    case 5:
      return 'text-bloom';
  }
}

/**
 * Return a Tailwind border-* class for the given growth stage.
 */
export function getGrowthBorderColor(stage: GrowthStage): string {
  switch (stage) {
    case 1:
      return 'border-seed';
    case 2:
      return 'border-sprout-light';
    case 3:
      return 'border-sprout';
    case 4:
      return 'border-bloom-light';
    case 5:
      return 'border-bloom';
  }
}

/**
 * Korean label for each growth stage.
 */
export function getGrowthLabel(stage: GrowthStage): string {
  switch (stage) {
    case 1:
      return '씨앗';
    case 2:
      return '새싹';
    case 3:
      return '줄기';
    case 4:
      return '꽃봉오리';
    case 5:
      return '꽃';
  }
}
