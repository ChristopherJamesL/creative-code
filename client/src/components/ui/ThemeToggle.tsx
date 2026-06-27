import { useTheme } from "../../context/theme/useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button onClick={toggle} aria-label="Toggle theme">
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
