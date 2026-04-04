import { nanoid } from "nanoid";

export default function slugify(title) {
  const baseSlug = title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

  const uniqueId = nanoid(6); 

  return `${baseSlug}-${uniqueId}`;
}