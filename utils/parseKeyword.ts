export default function parseKeywords(input: string) {
  return [...new Set(
    input
      .split(",")
      .map(k => k.trim().toLowerCase())
      .filter(Boolean)
  )];
}