import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { YogaCourseTypePage } from "@/components/yoga/YogaCourseTypePage";
import { YOGA_TYPES } from "@/lib/yogaCourses";

export const metadata: Metadata = {
  title: "Group Yoga Classes — Shastriya Yogshala | From ₹1,500",
  description:
    "Join our group yoga classes — 7 days a week, no weekly off. Classical yoga in a community setting. 1 month ₹1,500 | 3 months ₹4,000 | 6 months ₹7,000 | 1 year ₹12,000.",
};

export default function GroupYogaPage() {
  return (
    <>
      <Navbar />
      <YogaCourseTypePage data={YOGA_TYPES["group"]} />
      <Footer />
    </>
  );
}
