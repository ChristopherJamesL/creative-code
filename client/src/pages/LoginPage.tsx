import ThemeToggle from "../components/ui/ThemeToggle";
import Login from "../features/auth/components/Login";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-md p-8 border border-border">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-2xl font-bold text-card-foreground">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your account
          </p>
          <Login />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
