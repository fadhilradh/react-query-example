export function formatDate(date: string | undefined) {
  return new Date(date).toLocaleString("id-Id");
}
