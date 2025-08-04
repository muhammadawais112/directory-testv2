"use client";
import { usePathname, useParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const { agency_id } = useParams();
  const hideHeader = pathname?.includes("/app");
  return (
    <>
      {/* {hideHeader ? <Header agency_id={agency_id} /> : <Header />}
      {children}
      <Footer /> */}

      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {/* <TopNavbar /> */}
        {hideHeader ? <Header agency_id={agency_id} /> : <Header />}
        <div className="min-h-screen bg-gray-50 text-black">{children}</div>
        <Footer />
      </div>
    </>
  );
}
