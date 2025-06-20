import { ReactNode } from "react";
import Sidebar from "./sidebar";
import ChatWidget from "../chat/chat-widget";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <ChatWidget />
    </div>
  );
}
