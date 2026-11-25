export function scrollToId(id: string): void {
  if (typeof document === "undefined") return;
  const element = document.getElementById(id);
  if (!element) return;
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
    block: "start",
  });
}
