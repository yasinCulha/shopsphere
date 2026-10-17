export default function truncateText(text: string, maxLength: number = 30): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength).trimEnd() + "...";
}
