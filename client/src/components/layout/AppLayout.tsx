import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto min-w-0 p-8 text-foreground">
        <Outlet />
      </main>
    </div>
  );
}
