import { ReactNode } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import ChatWidget from "../chat/chat-widget";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-[#f6f8fa]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto bg-[#f6f8fa]">
          {children}
        </main>
      </div>
      <ChatWidget />
    </div>
  );
}
