import React from "react";
import { amazonProductUrl, AmazonLocale } from "@lib/amazon";

type Props = {
  asin: string;
  text?: string;
  locale?: AmazonLocale;
  className?: string;
  children?: React.ReactNode; // allow children as label too
};

export default function AmazonLink({
  asin,
  text,
  locale = "com",
  className,
  children,
}: Props) {
  const href = amazonProductUrl({ asin, locale });
  const label = children ?? text ?? asin;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      className={className}
    >
      {label}
    </a>
  );
}
