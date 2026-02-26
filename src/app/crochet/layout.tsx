import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider, DialogProvider } from "@/components/elements";
import WebsiteNavbar from "@/components/website/WebsiteNavbar";
import WebsiteFooter from "@/components/website/WebsiteFooter";

export default function CrochetLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <DialogProvider>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <WebsiteNavbar />
            <main className="flex-1">{children}</main>
            <WebsiteFooter />
          </div>
        </AuthProvider>
      </DialogProvider>
    </ToastProvider>
  );
}