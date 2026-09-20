import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { YogaCourseTypePage } from "@/components/yoga/YogaCourseTypePage";
import { YOGA_TYPES } from "@/lib/yogaCourses";

export const metadata: Metadata = {
  title: "Online Personal Yoga Classes — Shastriya Yogshala | Daily 1 Hour",
  description:
    "Live one-on-one online yoga classes daily — 7 days a week, 1 hour per session. Fully personalized classical yoga. 1 month ₹10,000 | 3 months ₹27,000 | 6 months ₹48,000 | 1 year ₹84,000.",
};

export default function OnlinePersonalYogaPage() {
  return (
    <>
      <Navbar />
      <YogaCourseTypePage data={YOGA_TYPES["online-personal"]} />
      <Footer />
    </>
  );
}
