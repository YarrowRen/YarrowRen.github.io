import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

interface CommentsProps {
  slug: string;
}

export default function Comments({ slug }: CommentsProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const getTheme = () => {
      if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
        return localStorage.getItem("theme") as "light" | "dark";
      }
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
      return "light";
    };

    setTheme(getTheme());

    const handleThemeChange = () => {
      setTheme(getTheme());
    };

    document.addEventListener("astro:after-swap", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);

    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute("data-theme");
      if (newTheme && (newTheme === "light" || newTheme === "dark")) {
        setTheme(newTheme);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      document.removeEventListener("astro:after-swap", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="mt-12">
      <Giscus
        repo="YarrowRen/YarrowRen.github.io"
        repoId="R_kgDOOjS8fA"
        category="Announcements"
        categoryId="DIC_kwDOOjS8fM4CzUwN"
        mapping="pathname"
        term={`/posts/${slug}`}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={theme === "dark" ? "dark" : "light"}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
}