import Giscus, { type Theme } from "@giscus/react";
import { GISCUS } from "@/constants";
import { useEffect, useRef, useState } from "react";

interface CommentsProps {
  identifier: string;
  lightTheme?: Theme;
  darkTheme?: Theme;
}

export default function Comments({
  identifier,
  lightTheme = "light",
  darkTheme = "dark",
}: CommentsProps) {
  const getPreferredTheme = () => {
    if (typeof window === "undefined") {
      return "light";
    }

    const currentTheme = window.localStorage.getItem("theme");
    const browserTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    return currentTheme || browserTheme;
  };

  const [theme, setTheme] = useState(getPreferredTheme);
  const [renderNonce, setRenderNonce] = useState(0);
  const isInitialRender = useRef(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = ({ matches }: MediaQueryListEvent) => {
      setTheme(matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const themeButton = document.querySelector("#theme-btn");
    const handleClick = () => {
      setTheme((prevTheme: string) =>
        prevTheme === "dark" ? "light" : "dark"
      );
    };

    themeButton?.addEventListener("click", handleClick);

    return () => themeButton?.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    setRenderNonce(nonce => nonce + 1);
  }, [identifier]);

  useEffect(() => {
    const rerender = () => {
      setRenderNonce(nonce => nonce + 1);
    };

    document.addEventListener("astro:page-load", rerender);

    return () => {
      document.removeEventListener("astro:page-load", rerender);
    };
  }, []);

  return (
    <div className="mt-8">
      <Giscus
        key={`${identifier}-${renderNonce}`}
        theme={theme === "light" ? lightTheme : darkTheme}
        {...GISCUS}
      />
    </div>
  );
}
