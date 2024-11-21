"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button"

const ThemeSwitcher = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  if (!mounted) {
    return null;
  }

  return (
      <Button
          size="icon"
          className="h-12 w-12 rounded text-foreground dark:text-background"
          onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
          aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} theme`}
      >
        {resolvedTheme === "light" ? (
            <MoonIcon className="h-6 w-6" />
        ) : (
            <SunIcon className="h-6 w-6" />
        )}
      </Button>
  );
};

export default ThemeSwitcher;

