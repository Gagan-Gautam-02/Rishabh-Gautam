import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { YogaCourseTypePage } from "@/components/yoga/YogaCourseTypePage";
import { YOGA_TYPES } from "@/lib/yogaCourses";

export const metadata: Metadata = {
  title: "Personal Yoga Classes (In-Person) — Shastriya Yogshala | At Your Home",
  description:
    "One-on-one in-person yoga at your home or chosen location. Teacher comes to you. 1 month ₹15,000 | 3 months ₹40,000 | 6 months ₹72,000 | 12 months ₹1,20,000.",
};

export default function PersonalYogaPage() {
  return (
    <>
      <Navbar />
      <YogaCourseTypePage data={YOGA_TYPES["personal"]} />
      <Footer />
    </>
  );
}
