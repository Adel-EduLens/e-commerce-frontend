/**
 * Generates price range labels from an array of prices.
 * Splits into 4 even buckets based on min/max.
 */
export function buildPriceRanges(prices: number[]): string[] {
  if (prices.length === 0) return [];

  const min = Math.floor(Math.min(...prices));
  const max = Math.ceil(Math.max(...prices));

  if (min === max) return [`$${min}`];

  const step = Math.ceil((max - min) / 3);
  const b1 = min + step;
  const b2 = b1 + step;

  return [
    `Under $${b1}`,
    `$${b1}-${b2}`,
    `$${b2}+`,
  ];
}

/**
 * Checks if a price falls within a given range label.
 */
export function matchesPriceRange(price: number, range: string): boolean {
  const underMatch = range.match(/^Under \$(\d+)$/);
  if (underMatch) return price < Number(underMatch[1]);

  const rangeMatch = range.match(/^\$(\d+)-(\d+)$/);
  if (rangeMatch) return price >= Number(rangeMatch[1]) && price <= Number(rangeMatch[2]);

  const overMatch = range.match(/^\$(\d+)\+$/);
  if (overMatch) return price >= Number(overMatch[1]);

  return false;
}
