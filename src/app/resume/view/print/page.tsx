import type { Metadata } from "next";
import { getResume } from "@lib/resume";
import ResumePrint from "@components/resume/ResumePrint";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { absolute: 'Resume - Nate Shoffner' },
  robots: { index: false, follow: false },
};

export default function ResumePrintPage() {
  const resume = getResume();
  return <ResumePrint resume={resume} />;
}
