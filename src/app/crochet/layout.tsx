import WebsiteNavbar from "@/components/website/WebsiteNavbar";
import WebsiteFooter from "@/components/website/WebsiteFooter";

import "../../app/globals.css";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <WebsiteNavbar />
      <main className="flex-1">{children}</main>
      <WebsiteFooter />
    </div>
  );
}