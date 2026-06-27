import { Link } from "react-router";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function Navbar() {
  const { data: user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex h-14  items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="text-base font-semibold text-foreground hover:text-primary transition-colors"
        >
          Legal-App
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <span className="text-sm text-muted-foreground">{user.name}</span>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary active:bg-secondary/80 select-none touch-manipulation"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
