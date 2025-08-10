export type AmazonLocale = "com" | "co.uk" | "de" | "fr" | "ca" | "co.jp" | "com.au" | "it" | "es";

export function amazonProductUrl({
  asin,
  tag = import.meta.env.VITE_AMAZON_TAG,
  locale = "com",
}: {
  asin: string;
  tag?: string;
  locale?: AmazonLocale;
}) {
  const base = `https://www.amazon.${locale}/gp/product/${encodeURIComponent(asin)}`;
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  return `${base}?${params.toString()}`;
}
