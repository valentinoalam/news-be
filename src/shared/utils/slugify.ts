export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, '') // Trim - from end
    .replace(/-+/g, '-'); // Replace multiple - with single -
}
