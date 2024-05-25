export function shiftArray(array: string[], shift: number): string[] {
  return array.slice(shift).concat(array.slice(0, shift));
}