import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/lib/react-query-provider";
import { cn } from "@/lib/utils/cn";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

import { PageTransition } from "@/components/layout/PageTransition";

export const metadata: Metadata = {
  title: "MetroHCM | Hành Trình Xanh - Tốc Độ Tương Lai",
  description: "Hệ thống đặt vé tàu điện ngầm hiện đại nhất TP. Hồ Chí Minh. Tiết kiệm thời gian, bảo vệ môi trường.",
  manifest: "/manifest.json",
  themeColor: "#007AFF",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={cn(
        inter.variable, 
        outfit.variable, 
        "font-inter bg-background text-white antialiased selection:bg-primary/30"
      )}>
        <ReactQueryProvider>
          <div className="relative min-h-screen flex flex-col">
            {/* SENIOR FE: ENTERPRISE COMMAND HEADER */}
            <header className="fixed top-0 w-full z-50 bg-background/40 backdrop-blur-2xl border-b border-white/[0.03] py-6">
              <div className="max-w-[1800px] mx-auto px-10 flex justify-between items-center">
                
                {/* Brand & Mission Line */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_15px_rgba(0,122,255,0.5)]" />
                     <div className="text-2xl md:text-3xl font-black bg-metro-gradient bg-clip-text text-transparent italic tracking-tighter">
                        MetroHCM
                     </div>
                  </div>
                  <div className="h-6 w-[1px] bg-white/10 hidden lg:block" />
                  <div className="hidden lg:flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/80 leading-none">
                        Pulse of Line 1
                     </span>
                     <span className="text-[7px] font-bold text-white/40 uppercase tracking-widest mt-1">System_Operational // v3.1.0</span>
                  </div>
                </div>

                {/* CENTRAL NAVIGATION: BALANCED POSITION */}
                <nav className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-100 absolute left-1/2 -translate-x-1/2">
                  <a href="#" className="hover:text-primary transition-all hover:tracking-[0.3em]">Tuyến đường</a>
                  <a href="#" className="hover:text-primary transition-all hover:tracking-[0.3em]">Giá vé</a>
                  <a href="#" className="hover:text-primary transition-all hover:tracking-[0.3em]">Tin tức</a>
                </nav>

                {/* Primary Action */}
                <div className="flex items-center">
                  <button className="group relative px-8 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all shadow-[0_0_20px_rgba(0,122,255,0.1)]">
                     <div className="relative z-10 flex items-center gap-2">
                        <span>Đăng nhập</span>
                        <div className="flex gap-0.5">
                           <div className="w-0.5 h-0.5 rounded-full bg-current opacity-40" />
                           <div className="w-0.5 h-0.5 rounded-full bg-current opacity-40" />
                        </div>
                     </div>
                  </button>
                </div>

              </div>
            </header>

            <main className="flex-grow pt-0 overflow-hidden">
              <PageTransition>
                {children}
              </PageTransition>
            </main>

            {/* Footer placeholder */}
            <footer className="py-12 border-t border-white/5 bg-black/20">
              <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                © 2024 MetroHCM. Phát triển bởi Đội ngũ Senior Architect.
              </div>
            </footer>
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
