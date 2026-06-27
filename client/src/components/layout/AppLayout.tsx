import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="flex h-screen  flex-col bg-background">
      <Navbar />

      <div className="flex flex-1 min-h-0">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 text-foreground">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
