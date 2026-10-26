/**
 * Grid tracks for repeated items: the space between two items is its own track, never a gap.
 * tracks(3, "auto", "1rem") → "auto 1rem auto 1rem auto"; an item i sits on track at(i).
 */
export function tracks(count: number, item = "auto", gutter = "1rem"): string {
	return Array.from({ length: count }, () => item).join(` ${gutter} `);
}

export function at(index: number): number {
	return index * 2 + 1;
}
