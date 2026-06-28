import ThemeToggle from "../components/ui/ThemeToggle";
import Login from "../features/auth/components/Login";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-xs">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground">
            <span className="text-[10px] font-bold text-background leading-none select-none">L</span>
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">Legal</span>
        </div>

        {/* Form card */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h1 className="text-base font-semibold text-card-foreground">Sign in</h1>
          <p className="mt-1 text-xs text-muted-foreground mb-6">
            Access your legal document workspace.
          </p>
          <Login />
        </div>

        {/* Theme toggle */}
        <div className="flex justify-center mt-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
