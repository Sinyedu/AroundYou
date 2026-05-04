export function optionalString(
  source: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = source[key]
  return typeof value === 'string' ? value : undefined
}
