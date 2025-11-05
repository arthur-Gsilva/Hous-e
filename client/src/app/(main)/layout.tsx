import { Header } from "@/components/Header";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        
        {children}
        
    </div>
  );
}
