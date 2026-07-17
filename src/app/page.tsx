import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LandingPage } from "@/components/landing/LandingPage";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <LandingPage />
      <Footer />
    </>
  );
}
