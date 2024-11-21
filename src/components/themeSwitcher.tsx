"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button"

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  // Now we can safely check the theme
  const currentTheme =
      theme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light"
          : theme;

  return (
        <Button
            size="icon"
            className="h-12 w-12 rounded"
            onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")}
            aria-label={`Switch to ${currentTheme === "light" ? "dark" : "light"} theme`}
        >
          {currentTheme === "light" ? (
              <MoonIcon />
          ) : (
              <SunIcon />
          )}
        </Button>
  );
};

export default ThemeSwitcher;